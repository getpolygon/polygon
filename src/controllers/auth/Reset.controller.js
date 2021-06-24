const _ = require("lodash");
const Express = require("express");
const nodePin = require("node-pin");
const { format } = require("date-fns");
const redis = require("../../db/redis");
const mailer = require("../../helpers/mailer");
const { AccountSchema } = require("../../models");

const ResetController = {
  /**
   * This function receives the request and
   * processes it for resetting user's password
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {Express.Response}
   */
  resetPassword: async (req, res) => {
    const email = _.toLower(req.body.email);
    const account = await AccountSchema.findOne({ email });

    // If the account does not exist
    if (!account) return res.status(404).send();
    else {
      try {
        // Sending the response instantly
        res.status(201).send();
        // Sending an email in the background
        await mailer.send(
          account.email,
          "Your password reset PIN for Usocial",
          "Your password reset PIN for Usocial",
          `
          <div style="font-family: sans-serif;">
            <h1>
              Hello, <b>${account.firstName}</b>.
            </h1>
            <p>
              As per your request, from IP address <b>${req.ip}</b> at ${format(
                new Date(),
                "io MMMM hh:mm:ss yyyy"
              )},
              we're sending this email to confirm that your one-time PIN code is ready.
            </p>
              
            <p>Your PIN is: <b>${nodePin.generateRandPin(4)}</b></p>

            <p>Usocial Team.</p>
          </div>
          `
        );
      } catch (error) {
        /**
         * Doing nothing if there's an error
         * Instead, we can receive another,
         * request from the client-size with a "Didn't receive the email" link
         */
        return;
      }
    }
  },
};

module.exports = ResetController;
