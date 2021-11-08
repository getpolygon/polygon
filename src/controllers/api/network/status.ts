import express from "express";
import redis from "../../../db/redis";

// For getting the status of a certain user
const status = (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  if (!id) return res.sendStatus(400);

  redis.get(id, (error, reply) => {
    if (error) console.error(error);

    const parsed = JSON.parse(reply!!) || { connected: false };
    return res.json(parsed);
  });
};

export default status;
