import redis from "db/redis";
import type { Request, Response } from "express";

// For getting the status of a certain user
const status = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.sendStatus(400);

  try {
    const __payload = await redis.get(id);
    const payload = JSON.parse(__payload!) || { connected: false };

    return res.json(payload);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default status;
