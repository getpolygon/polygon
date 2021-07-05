import Express from "express";
import redis from "../../db/redis";

const NetworkAPIController = {
  // For storing user status
  heartbeat: (req: Express.Request, res: Express.Response) => {
    // Getting the ID of the user
    const { id } = req.user!!;

    // Setting connection status to true
    redis.set(id, JSON.stringify({ connected: true }));
    // Setting a TTL on the key to delete it after 10 minutes
    redis.expire(id, 1000 * 5 * 60);
    // Getting the key value from the database
    redis.get(id, (error, reply) => {
      // If there was an error
      if (error) console.error(error);
      else {
        // If there is a reply
        if (reply) res.json(JSON.parse(reply));
        else return res.json({ connected: false });
      }
    });
  },

  // For getting the status of a certain user
  status: (req: Express.Request, res: Express.Response) => {
    // Getting the ID of current user
    const { id } = req.user!!;
    // ID provided in the optional query
    const { accountId } = req.query;

    // If no accountId was provided getting current user's status
    redis.get(accountId?.toString() || id, (error, reply) => {
      if (error) console.error(error);
      else return res.json(JSON.parse(reply!!));
    });
  },
};

module.exports = NetworkAPIController;
