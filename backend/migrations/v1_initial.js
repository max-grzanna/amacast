export const up = (knex) => {
  console.log("v1 up");
  return knex.schema
    .createTable("connector", (table) => {
      table.increments("id").primary();
      table.string("name");
      table.string("type"); // csv_download
      table.string("download_url");
      table.string("ref_url");
    })
    .createTable("timeseries", (table) => {
      table.increments("id").primary();
      table.string("identifier");
      table.string("name");
      table.integer("connector_id").references("connector.id");
      table.unique(["identifier", "connector_id"], {
        indexName: "timeseries_identifier_connector_id_unique",
      });
    })
    .createTable("timeseries_data", (table) => {
      table.datetime("timestamp");
      table.integer("timeseries_id").references("timeseries.id");
      table.double("value");
      table.unique(["timestamp", "timeseries_id"], {
        indexName: "timeseries_data_timestamp_timeseries_id_unique",
      });
    })
    .createTable("analysis", (table) => {
      table.increments("id").primary();
      table.string("name");
      table.string("identifier_matcher");
      table.string("type"); // trend, change_point
      table.double("upper_limit");
      table.double("lower_limit");
    });
};

export const down = (knex) => {
  throw new Error("not_implemented");
};
