const _ = require("lodash");
const minio = require("minio");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const {
  MINIO_ENDPOINT,
  MINIO_BUCKET,
  MINIO_PORT,
  MINIO_ACCKEY,
  MINIO_SECKEY,
  MINIO_USESSL
} = process.env;
const MinIOClient = new minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: parseInt(MINIO_PORT),
  accessKey: MINIO_ACCKEY,
  secretKey: MINIO_SECKEY,
  useSSL: JSON.parse(MINIO_USESSL.toLowerCase())
});
const emailValidator = require("email-validator");

const AccountSchema = require("../models/account");

router.get("/fetch", async (req, res) => {
  const { accountId, token } = req.query;
  var foundAccount = {};

  if (accountId) {
    foundAccount = await AccountSchema.findById(accountId);
  }

  if (token) {
    const decodedData = jwt.verify(token, process.env.JWT_Token);
    foundAccount = await AccountSchema.findOne({ email: decodedData.email });
  }

  const payload = {
    _id: foundAccount._id,
    email: foundAccount.email,
    pictureUrl: foundAccount.pictureUrl,
    friends: foundAccount.friends,
    isPrivate: foundAccount.isPrivate,
    posts: foundAccount.posts,
    bio: foundAccount.bio,
    fullName: foundAccount.fullName,
    firstName: foundAccount.firstName,
    lastName: foundAccount.lastName
  };
  res.json(payload);
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
