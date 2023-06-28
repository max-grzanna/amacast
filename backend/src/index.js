import express, { json } from "express";
import { migrate } from "./db";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { connectorRouter } from "./router";

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

  // app routers
  app.use("/connector", connectorRouter);

  const port = process.env.PORT || 7001;
  // start express server
  app.listen(port, () => {
    console.info(`backend listening on port ${port}`);
  });
};

main().catch((error) => console.error("main", error));
