import knex from "knex";

const dbConfig = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 7432,
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "pass",
    database: process.env.DB_NAME || "amacast",
  },
  searchPath: ["public"],
};

export const db = knex(dbConfig);

export const migrate = async () => {
  const dbConfig = {
    directory: "./migrations",
  };
  await db.migrate.latest(dbConfig);
  console.info(`Successfully applied migrations`);
};
