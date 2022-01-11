import redis from "db/redis";
import { isNil } from "lodash";
import type { Request, Response } from "express";

// For getting the status of a certain user
const status = async (req: Request, res: Response) => {
  const { id } = req.params;

  const __payload = await redis.get(id);
  if (isNil(__payload)) return res.json({ connected: false });
  else {
    const payload = JSON.parse(__payload!);
    return res.json(payload);
  }
};

export default status;
