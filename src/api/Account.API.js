const _ = require("lodash");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const emailValidator = require("email-validator");

const MinIO = require("../utils/minio");
const AccountSchema = require("../models/account");

router.get("/fetch", async (req, res) => {
  const { accountId } = req.query;
  const { jwt: token } = req.cookies;

  if (token && !accountId) {
    // Filter for current account
    const Filter = {
      fullName: null,
      firstName: null,
      lastName: null,
      email: null,
      bio: null,
      pictureUrl: null,
      isPrivate: null,
      posts: null,
      date: null,
      friends: null,
      _id: null
    };

    return jwt.verify(token, process.env.JWT_Token, async (error, data) => {
      if (error) {
        return res.json(403).json({
          error: error
        });
      } else if (data) {
        const foundAccount = await AccountSchema.findById(data.id);
        const payload = _.pick(foundAccount, _.keys(Filter));
        return res.status(200).json(payload);
      }
    });
  } else if (accountId) {
    // Filter for other accounts
    const Filter = {
      fullName: null,
      bio: null,
      pictureUrl: null,
      isPrivate: null,
      posts: null,
      date: null,
      friends: null,
      _id: null
    };

    const foundAccount = await AccountSchema.findById(accountId);
    const payload = _.pick(foundAccount, _.keys(Filter));
    return res.status(200).json(payload);
  } else {
    return res.json({
      error: "Forbidden"
    });
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
// router.put("/update", async (req, res) => {
// TODO: Needs new implementation
// });

// For deleting the account
router.delete("/delete", async (req, res) => {
  const { jwt: token } = req.cookies;
  const { JWT_TOKEN } = process.env;

  jwt.verify(token, JWT_TOKEN, async (err, data) => {
    if (err) {
      return res.json({
        error: "Forbidden"
      });
    } else if (data) {
      try {
        const ObjectStream = MinIO.client.listObjectsV2(MinIO.bucket, data.id + "/", true);
        const _FILES_ = [];

        try {
          // Deleteing the account from MongoDB
          await AccountSchema.findByIdAndDelete(data.id);

          // Deleting all the uploads
          ObjectStream.on("data", (obj) => _FILES_.push(obj.name));
          ObjectStream.on("end", async () => {
            await MinIO.client.removeObjects(MinIO.bucket, _FILES_);
          });
        } catch (error) {
          console.error(error);
        }

        return res.clearCookie("jwt").json({
          message: "Deleted"
        });
      } catch (error) {
        console.error(error);
        return res.json({
          error: error
        });
      }
    }
  });
});

module.exports = router;
