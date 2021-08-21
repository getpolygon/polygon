import express from "express";
import redis from "../../db/redis";

// For storing user status
export const heartbeat = (req: express.Request, res: express.Response) => {
  // Getting the ID of the user
  const { username } = req.user!!;

  // Making the user appear as "connected"
  redis.set(username!!, JSON.stringify({ connected: true }));
  // Setting a TTL on the key to delete it after 10 minutes
  redis.expire(username!!, 10 * 60);
  redis.get(username!!, (error, reply) => {
    if (error) console.error(error);
    else {
      if (reply) res.json(JSON.parse(reply));
      else return res.json({ connected: false });
    }
  });
};

// For getting the status of a certain user
export const status = (req: express.Request, res: express.Response) => {
  // ID provided in the query
  const { username } = req.query;
  // Getting current username
  const { username: currentUsername } = req.user!!;

  // If no accountId was provided getting current user's status
  redis.get(username?.toString() || currentUsername!!, (error, reply) => {
    if (error) console.error(error);
    else return res.json(JSON.parse(reply!!));
  });
};
