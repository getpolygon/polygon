const _ = require("lodash");
const bcrypt = require("bcrypt");
const Express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = process.env;
const emailValidator = require("email-validator");
const AccountSchema = require("../../models/all/account");

/**
 * Login controller
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
module.exports = async (req, res) => {
  const { password } = req.body;
  const email = _.toLower(req.body.email);

  // If the email is valid and the password is provided
  if (emailValidator.validate(email) && password) {
    // Find the account with specified parameters
    const account = await AccountSchema.findOne({ email: email });

    // If the account exists
    if (account) {
      const same = await bcrypt.compare(password, account.password);

      if (same) {
        jwt.sign({ id: account.id }, JWT_PRIVATE_KEY, {}, (err, token) => {
          if (err) console.error(err);
          else {
            return res
              .cookie("jwt", token, {
                httpOnly: true,
                sameSite: "None",
                signed: true,
                secure: true,
              })
              .json({ token });
          }
        });
      } else return res.status(403).send();
    } else return res.status(204).send();
  } else return res.status(401).send();
};
