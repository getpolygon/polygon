import redis from "@db/redis";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";

// For getting the status of a certain user
const status: Handler = async (req, res) => {
  const { id } = req.params;

  const __payload = await redis.get(id);
  if (__payload === null) {
    return new APIResponse(res, { data: { connected: false } });
  } else {
    const payload = JSON.parse(__payload!);
    return new APIResponse(res, { data: payload });
  }
};

export default status;
