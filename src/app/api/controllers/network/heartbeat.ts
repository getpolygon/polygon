import redis from "@db/redis";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";

/**
 * For storing user status
 * After sending an authenticated request to this route
 * it will make user's profile appear as "online"
 */
const heartbeat: Handler = async (req, res) => {
  const id = req.user?.id!;

  await Promise.all([
    redis.set(id, JSON.stringify({ connected: true })),
    redis.expire(id, 10 * 60),
  ]);

  return new APIResponse(res, { data: { connected: true } });
};

export default heartbeat;
