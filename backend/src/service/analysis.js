import moment from "moment";
import { db } from "../db";

const analysisHost = process.env.ANALYSIS_HOST || "http://localhost:7001";

const fetchCapacity = async (data, config) => {
  const response = await fetch(`${analysisHost}/capacity`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_name: "api.csv",
      data: data.map(({ timestamp, value }) => ({
        time: moment(timestamp).format("YYYY-MM-DD HH:mm:ss.SSS"),
        value,
      })),
      max_capacity: config.analysis_max_capacity,
      min_capacity: config.analysis_min_capacity,
    }),
  });
  return response.json();
};

const fetchChangePoint = async (data) => {
  const response = await fetch(`${analysisHost}/changepoints`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_name: "api.csv",
      data: data.map(({ timestamp, value }) => ({
        time: moment(timestamp).format("YYYY-MM-DD HH:mm:ss.SSS"),
        value,
      })),
    }),
  });
  return response.json();
};

const analysisByTypeMap = {
  change_point: fetchChangePoint,
  trend: fetchCapacity,
};

const runAnalysis = async (config) => {
  const from = moment().subtract(6, "months").toDate();
  console.log(
    "runAnalysis",
    config.analysis_name,
    config.timeseries_identifier,
    { from }
  );
  const data = await db
    .select(["timestamp", "value"])
    .from("timeseries_data")
    .where({ timeseries_id: config.timeseries_id })
    .andWhere("timestamp", ">", from);
  console.log(
    "runAnalysis",
    config.analysis_name,
    config.timeseries_identifier,
    "dataSample",
    data[0]
  );
  const analyser = analysisByTypeMap[config.analysis_type];
  const result = await analyser(data, config);
  console.log(
    "runAnalysis",
    config.analysis_name,
    config.timeseries_identifier,
    "result",
    result
  );
  return result;
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
