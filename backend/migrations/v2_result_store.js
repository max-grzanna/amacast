export const up = (knex) => {
  console.log("v2 up");
  return knex.schema
    .createTable("trend", (table) => {
      table.increments("id").primary();
      table.integer("timeseries_id").references("timeseries.id");
      table.integer("analysis_id").references("analysis.id");
      table.double("upper_limit");
      table.double("lower_limit");
      table.datetime("created_at");
      table.datetime("timestamp");
      table.string("trend_type"); // upper_limit, lower_limit
      table.string("reaction_type"); // resolve, ignore
      table.datetime("reaction_at");
      table.text("comment");
      table.unique(["timeseries_id", "analysis_id", "trend_type"], {
        indexName: "trend_unique",
      });
    })
    .createTable("warning", (table) => {
      table.increments("id").primary();
      table.integer("timeseries_id").references("timeseries.id");
      table.integer("analysis_id").references("analysis.id");
      table.integer("trend_id").references("trend.id");
      table.datetime("created_at");
      table.datetime("timestamp_start");
      table.datetime("timestamp_end");
      table.string("reaction_type"); // resolve, ignore
      table.datetime("reaction_at");
      table.text("comment");
      table.unique(["timeseries_id", "analysis_id"], {
        indexName: "change_point_warning_unique",
      });
      table.unique(["timeseries_id", "analysis_id", "trend_id"], {
        indexName: "trend_warning_unique",
      });
    });
};

export const down = (knex) => {
  throw new Error("not_implemented");
};
