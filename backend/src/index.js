import express, { json } from "express";
import { migrate } from "./db";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { runAllAnalysis } from "./service/analysis";
import { runIngestAll } from "./service/ingest";
import { createRestRouter } from "./router/restRouterfactory";
import { customRouter } from "./router/custom";

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
  app.post("/trigger/runIngestAll", async (req, res) => {
    const result = await runIngestAll();
    res.send(result);
  });

  app.get("/trigger/runAnalysisAll", async (req, res) => {
    const result = await runAllAnalysis();
    res.send(result);
  });
  app.post("/trigger/runAnalysisAll", async (req, res) => {
    const result = await runAllAnalysis();
    res.send(result);
  });

  // app routers
  app.use("/connector", createRestRouter("connector"));
  app.use("/timeseries", createRestRouter("timeseries"));
  app.use("/analysis", createRestRouter("analysis"));
  app.use("/warning", createRestRouter("warning"));
  app.use("/trend", createRestRouter("trend"));
  app.use("/custom", customRouter);

  const port = process.env.PORT || 8080;
  // start express server
  app.listen(port, () => {
    console.info(`backend listening on port ${port}`);
  });
};

main().catch((error) => console.error("main", error));
