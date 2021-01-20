const _ = require("lodash");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const emailValidator = require("email-validator");

const AccountSchema = require("../models/account");

router.get("/fetch", async (req, res) => {
  const token = req.cookies.jwt;
  const { accountId } = req.query;
  const filter = [
    "fullName",
    "firstName",
    "lastName",
    "bio",
    "_id",
    "pictureUrl",
    "posts",
    "friends",
    "isPrivate",
    "date"
  ];

  if (token) {
    return jwt.verify(token, process.env.JWT_Token, async (err, data) => {
      if (err) {
        console.error(err);
        return res.json(403).json({
          error: "Forbidden"
        });
      } else if (data) {
        const foundAccount = await AccountSchema.findById(data.id);
        const payload = _.pick(foundAccount, filter);
        return res.status(200).json(payload);
      }
    });
  } else if (accountId) {
    const foundAccount = await AccountSchema.findById(accountId);
    const payload = _.pick(foundAccount, filter);
    return res.status(200).json(payload);
  }
});

// For checking the account
router.put("/check", async (req, res) => {
  const { q } = req.query;

  if (q == "email") {
    const inputEmail = req.body.email;
    // Validating user's email
    const validateEmail = emailValidator.validate(inputEmail);

    // If email validation fails
    if (validateEmail == false) {
      return res.json({
        emailValidity: false
      });
    }
    // If email validation succeeds
    else {
      try {
        const Account = await AccountSchema.findOne({ email: inputEmail });
        // Checking if there is an account with that email
        if (Account === null) {
          return res.status(200).json({
            permitted: false
          });
        }
        if (Account.email === inputEmail) {
          return res.status(200).json({
            permitted: true
          });
        }
      } catch (error) {
        return res.status(500).json({
          error: error
        });
      }
    }
  }
});

// For updating the account
router.put("/update", async (req, res) => {
  // TODO: Needs new implementation
});

// For deleting the account
router.delete("/delete", async (req, res) => {
  // TODO: Needs new implementation
});

module.exports = router;
