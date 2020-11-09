const minioConfig = require("../minio.config");
const router = require("express").Router();
// Instead of Firebase Storage, we are using MinIO
const minio = require("minio");
const MinIOClient = new minio.Client({
  endPoint:  minioConfig.MINIO_HOST,
  port:      minioConfig.MINIO_PORT,
  accessKey: minioConfig.MINIO_ACCKEY,
  secretKey: minioConfig.MINIO_SECKEY,
  useSSL:    minioConfig.MINIO_USESSL
});

const AccountSchema = require("../models/account");

router.delete("/", async (req, res) => {
  const email = req.cookies.email;
  const password = req.cookies.password;

  MinIOClient.removeObject('local', `${email}.png`, function (err) {
    if (err) {
      return console.log('Unable to remove object', err)
    }
  });

  await AccountSchema.findOneAndDelete({ email: email, password: password })
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
