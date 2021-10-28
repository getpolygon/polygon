import express from "express";
import redis from "../../../db/redis";

// For getting the status of a certain user
const status = (req: express.Request, res: express.Response) => {
  const { username } = req.query;

  redis.get(String(username), (error, reply) => {
    if (error) console.error(error);
    return res.json(JSON.parse(reply!!));
  });
};

export default status;
