import { camelCase } from "lodash";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

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
