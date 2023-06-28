import { Router } from "express";
import { db } from "../db";

export const connectorRouter = Router();

const getConnector = async (req, res, next) => {
  const connectors = await db("connector").select("*");
  res.send(connectors);
};

const postConnector = async (req, res, next) => {
  const connector = await db("connector").insert(req.body).returning("*");
  res.send(connector);
};

const patchConnector = async (req, res, next) => {
  const { id } = req.params;
  const connector = await db("connector")
    .update(req.body)
    .where({ id })
    .returning("*");
  res.send(connector);
};

const deleteConnector = async (req, res, next) => {
  const { id } = req.params;
  await db("connector").where({ id }).del();
  res.sendStatus(204);
};

connectorRouter.get("/", getConnector);
connectorRouter.post("/", postConnector);
connectorRouter.post("/:id", patchConnector);
connectorRouter.delete("/:id", deleteConnector);
