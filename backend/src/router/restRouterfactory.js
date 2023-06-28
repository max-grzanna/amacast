import { Router } from "express";
import { db } from "../db";

export const createRestRouter = (tableName) => {
  const router = Router();

  const get = async (req, res, next) => {
    const connectors = await db(tableName).select("*");
    res.send(connectors);
  };

  const post = async (req, res, next) => {
    const connector = await db(tableName).insert(req.body).returning("*");
    res.send(connector);
  };

  const patch = async (req, res, next) => {
    const { id } = req.params;
    const connector = await db(tableName)
      .update(req.body)
      .where({ id })
      .returning("*");
    res.send(connector);
  };

  const performDelete = async (req, res, next) => {
    const { id } = req.params;
    await db(tableName).where({ id }).del();
    res.sendStatus(204);
  };

  router.get("/", get);
  router.post("/", post);
  router.patch("/:id", patch);
  router.delete("/:id", performDelete);

  return router;
};
