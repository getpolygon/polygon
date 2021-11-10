import redis from "../../../db/redis";
import type { Request, Response } from "express";

/**
 * For storing user status
 * After sending an authenticated request to this route
 * it will make user's profile appear as "online"
 */
const heartbeat = (req: Request, res: Response) => {
  const { username } = req.user!!;

  redis.set(username!!, JSON.stringify({ connected: true }));
  // Setting a TTL on the key to delete it after 10 minutes
  redis.expire(username!!, 10 * 60);
  redis.get(username!!, (error, reply) => {
    if (error) console.error(error);

    if (reply) res.json(JSON.parse(reply));
    return res.json({ connected: false });
  });
};

export default heartbeat;
