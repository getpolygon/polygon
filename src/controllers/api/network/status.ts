import redis from "../../../db/redis";
import type { Request, Response } from "express";

// For getting the status of a certain user
const status = (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) return res.sendStatus(400);

  redis.get(id, (error, __payload) => {
    if (error) console.error(error);

    const payload = JSON.parse(__payload!!) || { connected: false };
    return res.json(payload);
  });
};

export default status;
