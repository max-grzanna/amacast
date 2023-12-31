import moment from "moment";
import { fetchToCurl } from "fetch-to-curl";
import { db } from "../db";

const analysisHost = process.env.ANALYSIS_HOST || "http://localhost:7001";

const fetchCapacity = async (inData, config) => {
  const data = inData.map(({ timestamp, value }) => ({
    time: moment(timestamp).format("YYYY-MM-DD HH:mm:ss.SSS"),
    value,
  }));
  const fetchParams = [
    `${analysisHost}/capacity`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_name: "api.csv",
        data,
        ...(config.analysis_upper_limit
          ? { max_capacity: config.analysis_upper_limit }
          : {}),
        ...(config.analysis_lower_limit
          ? { min_capacity: config.analysis_lower_limit }
          : {}),
      }),
    },
  ];
  if (!data || !data.length) {
    return null;
  }
  //console.log(fetchToCurl(...fetchParams));
  const response = await fetch(...fetchParams);
  return response.json();
};

const fetchChangePoint = async (inData) => {
  const data = inData.map(({ timestamp, value }) => ({
    time: moment(timestamp).format("YYYY-MM-DD HH:mm:ss.SSS"),
    value,
  }));
  const fetchParams = [
    `${analysisHost}/changepoints`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_name: "api.csv",
        data,
      }),
    },
  ];
  if (!data || !data.length) {
    return null;
  }
  //console.log(fetchToCurl(...fetchParams));
  const response = await fetch(...fetchParams);
  return response.json();
};

const analysisByTypeMap = {
  change_point: fetchChangePoint,
  trend: fetchCapacity,
};

const persistChangePoint = async (config, result) => {
  const { analysis_id, timeseries_id } = config;
  const { changepoints } = result;
  if (Array.isArray(changepoints)) {
    const [timestamp_start, timestamp_end] = changepoints;
    return await db("warning")
      .insert({
        created_at: new Date(),
        timeseries_id,
        analysis_id,
        timestamp_start,
        timestamp_end,
      })
      .onConflict(["timeseries_id", "analysis_id"])
      .merge()
      .returning("*");
  }
  return Promise.resolve(null);
};

const persistTrend = async (config, result) => {
  const {
    analysis_id,
    timeseries_id,
    analysis_upper_limit,
    analysis_lower_limit,
  } = config;
  const { type, upper_overrun_date, lower_overrun_date, slope, intercept } =
    result;
  const moment_upper_limit = moment(upper_overrun_date);
  const moment_lower_limit = moment(lower_overrun_date);
  let timestamp;
  let trend_type = type;
  if (upper_overrun_date && moment_upper_limit.isAfter(moment(new Date()))) {
    timestamp = moment_upper_limit.toDate();
    trend_type = "upper_limit";
  } else if (
    lower_overrun_date &&
    moment_lower_limit.isAfter(moment(new Date()))
  ) {
    timestamp = moment_lower_limit.toDate();
    trend_type = "lower_limit";
  }
  console.log("persistTrend", {
    timestamp,
    moment_upper_limit,
    moment_lower_limit,
  });
  return await db("trend")
    .insert({
      created_at: new Date(),
      timeseries_id,
      analysis_id,
      timestamp,
      timestamp_upper_limit: upper_overrun_date,
      timestamp_lower_limit: lower_overrun_date,
      trend_type,
      upper_limit: analysis_upper_limit,
      lower_limit: analysis_lower_limit,
      slope,
      intercept,
    })
    .onConflict(["timeseries_id", "analysis_id", "trend_type"])
    .merge()
    .returning("*");

  return Promise.resolve(null);
};

const resultPersistByTypeMap = {
  change_point: persistChangePoint,
  trend: persistTrend,
};

const runAnalysis = async (config) => {
  const logPrefix = `runAnalysis ${config.analysis_name} ${config.timeseries_identifier}`;
  const from = moment().subtract(6, "months").startOf("month").toDate();
  console.log(logPrefix, { from });
  const data = await db
    .select(["timestamp", "value"])
    .from("timeseries_data")
    .where({ timeseries_id: config.timeseries_id })
    .andWhere("timestamp", ">", from);
  console.log(logPrefix, "dataSample", data[0]);
  const analyser = analysisByTypeMap[config.analysis_type];
  try {
    const result = await analyser(data, config);
    if (!result) {
      console.error(logPrefix, "no result from analyser", result);
      return null;
    }
    console.log(logPrefix, "result", result);
    const persister = resultPersistByTypeMap[config.analysis_type];
    return await persister(config, result);
  } catch (e) {
    console.error(logPrefix, e);
    return null;
  }
};

export const runAllAnalysis = async () => {
  const query = db
    .select([
      "analysis.id as analysis_id",
      "analysis.name as analysis_name",
      "analysis.type as analysis_type",
      "analysis.lower_limit as analysis_lower_limit",
      "analysis.upper_limit as analysis_upper_limit",
      "timeseries.id as timeseries_id",
      "timeseries.identifier as timeseries_identifier",
    ])
    .from("analysis")
    .joinRaw(
      "join timeseries on analysis.identifier_matcher is null or timeseries.identifier like analysis.identifier_matcher"
    );
  console.log(query.toString());
  const configs = await query;
  console.log("runAllAnalysis", configs);
  return Promise.all(configs.map(runAnalysis));
};
