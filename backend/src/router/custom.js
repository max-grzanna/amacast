import { Router } from "express";
import moment from "moment";
import { db } from "../db";

const router = Router();

const getConfigs = async (req, res, next) => {
  const configs = await db
    .select([
      "analysis.id as analysis_id",
      "analysis.name as analysis_name",
      "analysis.type as analysis_type",
      "analysis.lower_limit as analysis_lower_limit",
      "analysis.upper_limit as analysis_upper_limit",
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
      "join timeseries on analysis.identifier_matcher is null or  timeseries.identifier like analysis.identifier_matcher"
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

const getTimeseriesData = async (req, res, next) => {
  const from = moment().subtract(36, "months").toDate();
  const timeseries_id = req.params.timeseries_id;
  if (!timeseries_id) {
    return [];
  }
  const data = await db
    .select(["timestamp", "value"])
    .from("timeseries_data")
    .where({ timeseries_id })
    .andWhere("timestamp", ">", from);
  res.send(data);
  return;
};

router.get("/config", getConfigs);
router.get("/timeseries_data/:timeseries_id", getTimeseriesData);
export const customRouter = router;
