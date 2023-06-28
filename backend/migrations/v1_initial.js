export const up = (knex) => {
  console.log("v1 up");
  return knex.schema.createTable("connector", (table) => {
    table.increments("id").primary();
    table.string("name");
    table.string("type");
    table.string("ref_url");
  });
};

export const down = (knex) => {
  throw new Error("not_implemented");
};
