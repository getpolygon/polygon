const redis = require("../../db/redis");
const safeStringify = require("fast-safe-stringify");

const NetworkAPIController = {
  // Used for sending a simple get request to the server and setting the key in redis
  heartbeat: (req, res) => {
    // Getting the ID of the user
    const { id } = req.user;

    // Setting connection status to true
    redis.set(id, safeStringify({ connected: true }));
    // Setting a TTL on the key to delete it after 5 minutes
    redis.expire(id, 10);
    // Getting the key value from the database
    redis.get(id, (error, reply) => {
      if (error) console.error(error);
      else {
        if (reply) res.json(JSON.parse(reply));
        else return res.json({ connected: false });
      }
    });
  },

  // Used for getting user status (online, offline, dnd, idle, ...)
  status: (req, res) => {
    // Getting the ID of current user
    const { id } = req.user;
    // ID provided in the optional query
    const { accountId } = req.query;

    redis.exists(accountId ? accountId : id, (error, reply) => {
      if (error) console.error(error);
      else {
        if (reply) return res.json({ connected: true });
        else return res.json({ connected: false });
      }
    });
  },
};

module.exports = NetworkAPIController;
