const _ = require("lodash");
const router = require("express").Router();
const { ENDPOINT, BUCKET, PORT, ACCKEY, SECKEY, USESSL } = require("../../config/minio");
const minio = require("minio");
const MinIOClient = new minio.Client({
  endPoint: ENDPOINT,
  port: PORT,
  accessKey: ACCKEY,
  secretKey: SECKEY,
  useSSL: USESSL
});
const AccountSchema = require("../models/account");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
// For checking the account
router.put("/check", async (req, res) => {
  let email = req.query.email;
  let password = req.query.password;
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
  } else {
    AccountSchema.findOne({
      email: email,
      password: password
    })
      .then((doc) => {
        if (doc) {
          res.json(doc);
        } else {
          res.json([]);
        }
      })
      .catch((e) => {
        res.json(e);
        console.log(e);
      });
  }
});

// For updating the account
router.put("/update", async (req, res) => {
  let currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
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
          res
            // Setting updated cookies
            .cookie("email", email)
            .cookie("password", password)
            .json({ email: doc.email, password: doc.password, status: "OK" });
        })
        .catch((e) => res.json(e));
    } else {
      res.json({ status: "ERR_ACC_EXISTS" });
    }
  }
});

// For deleting the account
router.delete("/delete", async (req, res) => {
  const email = req.cookies.email;
  const password = req.cookies.password;

  await MinIOClient.removeObject(BUCKET, `${email}.png`);

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
