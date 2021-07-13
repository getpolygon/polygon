import Express from "express";
import redis from "../../db/redis";

// For storing user status
export const heartbeat = (req: Express.Request, res: Express.Response) => {
  // Getting the ID of the user
  const { username } = req.user!!;

  // Setting connection status to true
  redis.set(username, JSON.stringify({ connected: true }));
  // Setting a TTL on the key to delete it after 10 minutes
  redis.expire(username, 10 * 60);
  // Getting the key value from the database
  redis.get(username, (error, reply) => {
    // If there was an error
    if (error) console.error(error);
    else {
      // If there is a reply
      if (reply) res.json(JSON.parse(reply));
      else return res.json({ connected: false });
    }
  });
};

// For getting the status of a certain user
export const status = (req: Express.Request, res: Express.Response) => {
  // ID provided in the optional query
  const { username } = req.query;
  // Getting the ID of current user
  const { username: currentUsername } = req.user!!;

  // If no accountId was provided getting current user's status
  redis.get(username?.toString() || currentUsername, (error, reply) => {
    if (error) console.error(error);
    else return res.json(JSON.parse(reply!!));
  });
};
