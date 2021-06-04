const { JWT_PRIVATE_KEY } = process.env;

const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
const AccountSchema = require("../../models/all/account");

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
    } else return res.status(404).send();
  } else return res.status(401).send();
};
