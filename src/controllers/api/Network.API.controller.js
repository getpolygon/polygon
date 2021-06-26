const Express = require("express");
const redis = require("../../db/redis");

const NetworkAPIController = {
  /**
   * Used for sending a simple get request
   * to the server and setting the key in redis
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {Express.Response}
   */
  heartbeat: (req, res) => {
    // Getting the ID of the user
    const { id } = req.user;

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

  /**
   * Used for getting user's status
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  status: (req, res) => {
    // Getting the ID of current user
    const { id } = req.user;
    // ID provided in the optional query
    const { accountId } = req.query;

    // If no accountId was provided getting current user's status
    redis.get(accountId || id, (error, reply) => {
      if (error) console.error(error);
      else return res.json({ connected: reply });
    });
  },
};

module.exports = NetworkAPIController;
