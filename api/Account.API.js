const router = require("express").Router();
const minioConfig = require("../minio.config");
// Instead of Firebase Storage, we are using MinIO
const minio = require("minio");
const MinIOClient = new minio.Client({
  endPoint: minioConfig.MINIO_HOST,
  port: minioConfig.MINIO_PORT,
  accessKey: minioConfig.MINIO_ACCKEY,
  secretKey: minioConfig.MINIO_SECKEY,
  useSSL: minioConfig.MINIO_USESSL,
});
const AccountSchema = require("../models/account");
const emailValidator = require("email-validator");
// For checking the account
router.put("/check", async (req, res) => {
  let email = req.query.email;
  let password = req.query.password;

  AccountSchema.findOne({
    email: email,
    password: password,
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
});

router.put("/check/email", async (req, res) => {
  const inputEmail = await req.body.email;
  // Validating user's email
  const validateEmail = await emailValidator.validate(inputEmail);

  // If email validation fails
  if (validateEmail == false) {
    res.json({
      emailValidity: false,
    });
  }

  // If email validation succeeds
  else {
    await AccountSchema.findOne({ email: inputEmail })
      .then((doc) => {
        if (doc == null) {
          res.json({
            result: false,
            emailValidity: true,
          });
          return;
        }
        if (doc.email == inputEmail) {
          res.json({
            result: true,
            emailValidity: true,
          });
          return;
        }
        if (!doc) {
          res.json({
            result: false,
            emailValidity: true,
          });
          return;
        } else {
          res.json({
            result: false,
            emailValidity: true,
          });
          return;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
});

// For updating the account
router.put("/update", async (req, res) => {
  let currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password,
  });
  let { firstName, lastName, bio, email, password, privacy } = req.query;

  if (privacy) {
    await currentAccount
      .updateOne({
        isPrivate: privacy,
      })
      .then((response) => {
        res.json(response.privacy);
      })
      .catch((e) => {
        res.json(e);
      });
  }
  if (bio) {
    await currentAccount
      .updateOne({
        bio: bio,
      })
      .then((response) => {
        res.json(response.bio);
      })
      .catch((e) => {
        res.json(e);
      });
  }
  if (firstName || lastName) {
    await currentAccount
      .update({
        firstName: firstName,
        lastName: lastName,
        fullName: `${firstName} ${lastName}`,
      })
      .then((response) => {
        res.json({
          firstName: response.firstName,
          lastName: response.lastName,
          fullName: response.fullName,
        });
      })
      .catch((e) => res.json(e));
  }
  if (email && password) {
    if (email) {
      await currentAccount
        .updateOne({
          email: email,
        })
        .then((response) => {
          res.json(response.email);
        })
        .catch((e) => {
          res.json(e);
        });
    }
    if (password) {
      await currentAccount
        .updateOne({
          password: password,
        })
        .then((response) => {
          res.json(response.password);
        })
        .catch((e) => {
          res.json(e);
        });
    }
    if (email && password) {
      await currentAccount
        .update({
          email: email,
          password: password,
        })
        .then((response) => {
          res.json({
            email: response.email,
            password: response.password,
          });
        })
        .catch((e) => {
          res.json(e);
        });
    }
  }
});

// For deleting the account
router.delete("/delete", async (req, res) => {
  const email = req.cookies.email;
  const password = req.cookies.password;

  MinIOClient.removeObject("local", `${email}.png`, function (err) {
    if (err) {
      return console.log("Unable to remove object", err);
    }
  });

  await AccountSchema.findOneAndDelete({
    email: email,
    password: password,
  })
    .then((result) => {
      res.clearCookie("email");
      res.clearCookie("password");
      res.json({
        result: result,
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
