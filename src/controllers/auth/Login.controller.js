const { JWT_TOKEN } = process.env;

const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
const AccountSchema = require("../../models/all/account");

exports.login = async (req, res) => {
  const { password } = req.body;
  const email = _.toLower(req.body.email);

  if (emailValidator.validate(email) && password) {
    const account = await AccountSchema.findOne({ email: email });

    if (account) {
      const same = await bcrypt.compare(password, account.password);

      if (same) {
        jwt.sign(
          { id: account._id },
          JWT_TOKEN,
          {
            expiresIn: "1h",
          },
          (err, token) => {
            if (err) return res.status(403).json(err);
            else {
              return res
                .status(200)
                .cookie("jwt", token, {
                  httpOnly: true,
                  sameSite: true,
                  signed: true,
                  secure: true,
                })
                .json(token);
            }
          }
        );
      } else {
        // TODO
      }
    } else {
      // TODO
    }
  } else {
    // TODO
  }
};
