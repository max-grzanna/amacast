import express, { json } from "express";
import { migrate } from "./db";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { connectorRouter } from "./router";
import { runAllAnalysis } from "./service/analysis";
import { runIngestAll } from "./service/ingest";

const main = async () => {
  // connect to db and run migrations
  await migrate();

  // initialize app
  const app = express();

  // default json api middlewares
  app.use(corsMiddleware);
  app.use(json());

  // request logger middleware
  app.use((req, _res, next) => {
    console.info(
      `${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`
    );
    next();
  });

  // ping endpoint to check for liveliness
  app.get("/ping", (_req, res) => {
    res.send("pong");
  });

  app.get("/trigger/runIngestAll", async (req, res) => {
    const result = await runIngestAll();
    res.send(result);
  });

  app.get("/trigger/runAnalysisAll", async (req, res) => {
    const result = await runAllAnalysis();
    res.send(result);
  });

  // app routers
  app.use("/connector", connectorRouter);

  const port = process.env.PORT || 8080;
  // start express server
  app.listen(port, () => {
    console.info(`backend listening on port ${port}`);
  });
};

main().catch((error) => console.error("main", error));