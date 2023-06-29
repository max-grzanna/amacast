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
        max_capacity: config.analysis_max_capacity,
        min_capacity: config.analysis_min_capacity,
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
        timeseries_id,
        analysis_id,
        timestamp_start,
        timestamp_end,
      })
      .onConflict()
      .ignore()
      .returning("*");
  }
  return Promise.resolve(null);
};

const persistTrend = async (config, result) => {
  const { analysis_id, timeseries_id } = config;
  const { type, overrun_date } = result;
  if (overrun_date) {
    return await db("trend")
      .insert({
        timeseries_id,
        analysis_id,
        timestamp: overrun_date,
        trend_type: type,
      })
      .onConflict()
      .ignore()
      .returning("*");
  }
  return Promise.resolve(null);
};

const resultPersistByTypeMap = {
  change_point: persistChangePoint,
  trend: persistTrend,
};

const runAnalysis = async (config) => {
  const logPrefix = `runAnalysis ${config.analysis_name} ${config.timeseries_identifier}`;
  const from = moment().subtract(6, "months").toDate();
  console.log(logPrefix, { from });
  const data = await db
    .select(["timestamp", "value"])
    .from("timeseries_data")
    .where({ timeseries_id: config.timeseries_id })
    .andWhere("timestamp", ">", from);
  console.log(logPrefix, "dataSample", data[0]);
  const analyser = analysisByTypeMap[config.analysis_type];
  const result = await analyser(data, config);
  if (!result) {
    console.error(logPrefix, "no result from analyser", result);
    return null;
  }
  console.log(logPrefix, "result", result);
  const persister = resultPersistByTypeMap[config.analysis_type];
  return await persister(config, result);
};

export const runAllAnalysis = async () => {
  const configs = await db
    .select([
      "analysis.id as analysis_id",
      "analysis.name as analysis_name",
      "analysis.type as analysis_type",
      "analysis.min_capacity as analysis_min_capacity",
      "analysis.max_capacity as analysis_max_capacity",
      "timeseries.id as timeseries_id",
      "timeseries.identifier as timeseries_identifier",
    ])
    .from("analysis")
    .joinRaw(
      "join timeseries on analysis.identifier_matcher is null or analysis.identifier_matcher like timeseries.identifier"
    );
  return Promise.all(configs.map(runAnalysis));
};
