const _ = require("lodash");
const router = require("express").Router();
const {
  MINIO_ENDPOINT,
  MINIO_BUCKET,
  MINIO_PORT,
  MINIO_ACCKEY,
  MINIO_SECKEY,
  MINIO_USESSL
} = process.env;
const minio = require("minio");
const MinIOClient = new minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: parseInt(MINIO_PORT),
  accessKey: MINIO_ACCKEY,
  secretKey: MINIO_SECKEY,
  useSSL: JSON.parse(MINIO_USESSL.toLowerCase())
});
const jwt = require("jsonwebtoken");
const AccountSchema = require("../models/account");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");

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
  let { q } = req.query;

  if (q == "email") {
    const inputEmail = await req.body.email;
    // Validating user's email
    const validateEmail = emailValidator.validate(inputEmail);

    // If email validation fails
    if (validateEmail == false) {
      res.json({
        emailValidity: false
      });
    }

    // If email validation succeeds
    else {
      await AccountSchema.findOne({ email: inputEmail })
        .then((doc) => {
          if (doc == null) {
            res.json({
              result: false,
              emailValidity: true
            });
            return;
          }
          if (doc.email == inputEmail) {
            res.json({
              result: true,
              emailValidity: true
            });
            return;
          }
          if (!doc) {
            res.json({
              result: false,
              emailValidity: true
            });
            return;
          } else {
            res.json({
              result: false,
              emailValidity: true
            });
            return;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
});

// For updating the account
router.put("/update", async (req, res) => {
  let currentAccount = await AccountSchema.findOne({
    email: req.session.email,
    password: req.session.password
  });
  let { bio, email, password, privacy } = req.query;

  if (privacy) {
    await currentAccount
      .updateOne({
        isPrivate: privacy
      })
      .then(() => {
        res.json({ info: "OK" });
      })
      .catch((e) => {
        res.json(e);
      });
  }
  if (bio) {
    await currentAccount
      .updateOne({
        bio: bio
      })
      .then((response) => {
        res.json(response.bio);
      })
      .catch((e) => {
        res.json(e);
      });
  }

  if (email && password) {
    const checkDupl = await AccountSchema.findOne({ email: email });
    if (checkDupl == null) {
      password = await bcrypt.hash(password, 10).catch((e) => console.error(e));
      // Updating the actual account
      await currentAccount.updateOne({
        email: email,
        password: password
      });

      if (currentAccount.posts.length != 0) {
        // Updating the email in each post
        _.each(currentAccount.posts, (post) => {
          post.authorEmail = email;
        });
        await currentAccount.save();
      }

      // Finding the updated account and sending it to the client
      await AccountSchema.findOne({ email: email, password: password })
        .then((doc) => {
          req.session.email = email;
          req.session.password = password;
          res.json({ email: doc.email, password: doc.password, status: "OK" });
        })
        .catch((e) => res.json(e));
    } else {
      res.json({ status: "ERR_ACC_EXISTS" });
    }
  }
});

// For deleting the account
router.delete("/delete", async (req, res) => {
  const email = req.session.email;
  const password = req.session.password;

  await MinIOClient.removeObject(MINIO_BUCKET, `${email}.png`);

  await AccountSchema.findOneAndDelete({
    email: email,
    password: password
  })
    .then((result) => {
      res.clearCookie("email");
      res.clearCookie("password");
      res.json({
        result: result
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
