require("mongoose");
const router = require("express").Router();
// Instead of Firebase Storage, we are using MinIO
const minio = require("minio");
const MinIOClient = new minio.Client({
  endPoint: "localhost",
  port: 9000,
  accessKey: "AKIAIOSFODNN7EXAMPLE",
  secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  useSSL: false
});

const AccountSchema = require("../models/account");
const PostSchema = require("../models/post");

router.post("/", async (req, res) => {
  const email = req.cookies.email;
  const password = req.cookies.password;

  MinIOClient.removeObject('local', `${email}.png`, function (err) {
    if (err) {
      return console.log('Unable to remove object', err)
    }
  });

  Promise.all([
    // Find posts and the account associated with the email
    await PostSchema.deleteMany({ authorEmail: email }),
    await AccountSchema.findOneAndDelete({ email: email, password: password }),
  ])
    .then((result) => {
      res.clearCookie("email");
      res.clearCookie("password");
      res.json({ result: result });
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
