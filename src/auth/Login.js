const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const AccountSchema = require("../models/account");
const emailValidator = require("email-validator");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  if (emailValidator.validate(email)) {
    AccountSchema.findOne({
      email: email
    })
      .then((doc) => {
        if (doc !== null) {
          bcrypt
            .compare(password, doc.password)
            .then((result) => {
              if (result === true) {
                const token = jwt.sign(
                  {
                    email: doc.email,
                    password: doc.password
                  },
                  process.env.JWT_TOKEN
                );
                return res.status(200).json({
                  token: token
                });
              }
            })
            .catch((error) => {
              return res.status(500).json({
                error: error
              });
            });
        } else {
          return res.status(200).json({
            error: "Forbidden"
          });
        }
      })
      .catch((error) => {
        return res.status(500).json({
          error: error
        });
      });
  }
});

module.exports = router;
