import { camelCase } from "lodash";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:7002";

export const postConnector = async (data) => {
  const response = await fetch(BACKEND_URL + "/connector", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

export const getConnectors = async () => {
  const response = await fetch(BACKEND_URL + "/connector");
  return await response.json();
};

export const getConfigs = async () => {
  const response = await fetch(BACKEND_URL + "/custom/config");
  return await response.json();
};

export const getWarnings = async () => {
  const response = await fetch(BACKEND_URL + "/warning");
  return await response.json();
};

export const getTrends = async () => {
  const response = await fetch(BACKEND_URL + "/trend");
  return await response.json();
};

export const getTimeseriesData = async (timeseries_id) => {
  const response = await fetch(
    BACKEND_URL + `/custom/timeseries_data/${timeseries_id}`
  );
  return await response.json();
};

export const triggerIngest = async () => {
  await fetch(BACKEND_URL + "/trigger/runIngestAll");
  await fetch(BACKEND_URL + "/trigger/runAnalysisAll");
};

export const triggerAnalysis = async () => {
  await fetch(BACKEND_URL + "/trigger/runAnalysisAll");
};
