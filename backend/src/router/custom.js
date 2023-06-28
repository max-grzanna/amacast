import { Router } from "express";
import { db } from "../db";

const router = Router();

const getConfigs = async (req, res, next) => {
  const configs = await db
    .select([
      "analysis.id as analysis_id",
      "analysis.name as analysis_name",
      "analysis.type as analysis_type",
      "analysis.min_capacity as analysis_min_capacity",
      "analysis.max_capacity as analysis_max_capacity",
      "timeseries.id as timeseries_id",
      "timeseries.identifier as timeseries_identifier",
      "connector.id as connector_id",
      "connector.name as connector_name",
      "connector.type as connector_type",
      "connector.download_url as download_url",
      "connector.ref_url as ref_url",
    ])
    .from("analysis")
    .joinRaw(
      "join timeseries on analysis.identifier_matcher is null or analysis.identifier_matcher like timeseries.identifier"
    )
    .joinRaw("join connector on timeseries.connector_id = connector.id");
  const dataPoints = await db
    .select(["c.timeseries_id", "c.count"])
    .fromRaw(
      "(select timeseries_id, count(*) from timeseries_data group by timeseries_id) c"
    );
  if (!dataPoints) {
    res.send(configs);
    return;
  }
  const result = configs.map((config) => {
    const dataPoint = dataPoints.find(
      (dataPoint) => dataPoint.timeseries_id === config.timeseries_id
    );
    return {
      ...config,
      dataPointCount: dataPoint?.count || 0,
    };
  });
  res.send(result);
  return;
};

router.get("/config", getConfigs);
export const customRouter = router;
