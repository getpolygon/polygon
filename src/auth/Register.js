const _ = require("lodash");
const path = require("path");
const minio = require("minio");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { unlinkSync } = require("fs");
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
const storage = multer.diskStorage({
  destination: path.resolve("tmp"),
  filename: (err, file, cb) => {
    cb(null, `${file.originalname}`);
    if (err) return console.log(err);
  }
});
const upload = multer({ storage: storage });

const AccountSchema = require("../models/account");
const emailValidator = require("email-validator");
const _checkForDuplicates = require("../helpers/checkForDuplicates");

router.post("/", upload.single("avatar"), async (req, res) => {
  const email = _.toLower(req.body.email);
  const hasValidEmail = await emailValidator(email);
  const hasDuplicates = await _checkForDuplicates({ email: email }, AccountSchema);

  if (hasValidEmail && !hasDuplicates) {
    const Account = new AccountSchema({
      _id: new mongoose.Types.ObjectId(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      fullName: `${req.body.firstName} ${req.body.lastName}`,
      email: email,
      bio: req.body.bio,
      isPrivate: req.body.privateCheck ? true : false,
      friends: {
        pending: [],
        approved: [],
        dismissed: [],
        requested: []
      },
      date: Date.now()
    });

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) console.error(err);
      Account.password = hash;
    });

    if (req.file) {
      MinIOClient.fPutObject(MINIO_BUCKET, `${Account._id}/${Account._id}.png`, req.file.path, {
        "Content-Type": req.file.mimetype
      });
      const presignedUrl = await MinIOClient.presignedGetObject(
        MINIO_BUCKET,
        `${Account._id}/${Account._id}.png`
      );
      Account.pictureUrl = presignedUrl;
      unlinkSync(path.resolve("tmp", req.file.originalname));
    } else {
      Account.pictureUrl = `https://avatars.dicebear.com/api/initials/${Account.fullName}.svg`;
    }

    await Account.save();

    return res.status(200).json({
      token: jwt.sign({ _id: Account._id }, process.env.JWT_TOKEN)
    });
  } else {
    return res.status(403).json({
      error: "Forbidden"
    });
  }
});

module.exports = router;
