import neatCsv from "neat-csv";
import { db } from "../db";
import groupBy from "lodash/groupBy";
import chunk from "lodash/chunk";

const downloadAndParseCsv = async (connector) => {
  const response = await fetch(connector.download_url);
  const text = await response.text();
  const parsed = await neatCsv(text, ["timestamp", "identifier", "value"]);
  return parsed.slice(1);
};

const runIngest = async (connector) => {
  console.info("Starting ingest for connector", connector);
  // only csv for now
  const data = await downloadAndParseCsv(connector);
  const groups = groupBy(data, "identifier");
  for (const identifier of Object.keys(groups)) {
    // create or get the timeseries
    await db("timeseries")
      .insert({
        identifier,
        connector_id: connector.id,
      })
      .onConflict(["identifier", "connector_id"])
      .ignore();
    const timeseries = await db
      .first("*")
      .from("timeseries")
      .where({ identifier, connector_id: connector.id });
    // insert the data
    const batches = chunk(groups[identifier], 1000);
    let i = 1;
    for (const batch of batches) {
      console.log("Insert example from batch", batch[0]);
      await db("timeseries_data")
        .insert(
          batch.map((row) => ({
            timestamp: row.timestamp,
            timeseries_id: timeseries.id,
            value: row.value,
          }))
        )
        .onConflict(["timestamp", "timeseries_id"])
        .ignore();
      console.info(
        "Inserted",
        i++,
        "of",
        batches.length,
        "batches for timeseries",
        identifier,
        connector
      );
    }
  }

  console.info("Finished ingest for connector", connector);
};

export const runIngestAll = async () => {
  const connectors = await db("connector").select("*");
  console.info("Running ingest all for connectors", connectors);
  return Promise.all(connectors.map(runIngest));
};
