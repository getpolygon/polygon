const { JWT_PRIVATE_KEY } = process.env;
const jwt = require("jsonwebtoken");
const redis = require("../../db/redis");
const safeStringify = require("fast-safe-stringify");

// Used for sending a simple get request to the server and setting the key in redis
exports.heartbeat = (req, res) => {
  const { id } = req.user;

  // Setting connection status to true
  redis.set(id, safeStringify({ connected: true }));
  // Setting a TTL on the key to delete it after 5 minutes
  redis.expire(id, 10);
  // Getting the key value from the database
  redis.get(id, (error, reply) => {
    if (error) {
      // TODO
    } else {
      if (!reply) return res.json({ connected: false });
      else return res.json(JSON.parse(reply));
    }
  });
};

// Used for getting user status (online, offline, dnd, idle, ...)
exports.status = (req, res) => {
  const { accountId } = req.query;
  const { jwt: token } = req.cookies;

  // If account id was provided
  if (accountId) {
    redis.exists(accountId, (err, reply) => {
      if (err) {
        // TODO
      } else {
        if (reply) return res.json({ connected: true });
        else return res.json({ connected: false });
      }
    });
  } else {
    // TODO
  }
};
