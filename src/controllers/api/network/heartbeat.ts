import redis from "db/redis";
import type { Request, Response } from "express";

/**
 * For storing user status
 * After sending an authenticated request to this route
 * it will make user's profile appear as "online"
 */
const heartbeat = async (req: Request, res: Response) => {
  const id = req.user?.id!;

  try {
    await redis.set(id, JSON.stringify({ connected: true }));
    await redis.expire(id, 10 * 60);
    return res.json({ connected: true });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default heartbeat;
