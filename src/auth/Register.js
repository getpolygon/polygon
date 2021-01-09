const _ = require("lodash");
const minio = require("minio");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { unlinkSync } = require("fs");
const router = require("express").Router();
const randomColorPair = require("random-color-pair");
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
  destination: "tmp/",
  filename: (err, file, cb) => {
    cb(null, `${file.originalname}`);
    if (err) return;
  }
});
const upload = multer({ storage: storage });

const AccountSchema = require("../models/account");
const _emailValidator = require("../helpers/emailValidator");
const _checkForDuplicates = require("../helpers/checkForDuplicates");

// To register the account
router.post("/", upload.single("avatar"), async (req, res) => {
  const email = _.toLower(req.body.email);
  const hasValidEmail = await _emailValidator(email);
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

    const url = async () => {
      if (req.file) {
        MinIOClient.fPutObject(MINIO_BUCKET, `${Account._id}/${Account._id}.png`, req.file.path, {
          "Content-Type": req.file.mimetype
        });
        const presignedUrl = await MinIOClient.presignedGetObject(
          MINIO_BUCKET,
          `${Account._id}/${Account._id}.png`
        );
        return presignedUrl;
      } else {
        const [foreground, background] = randomColorPair();
        return `https://ui-avatars.com/api/?name=${
          Account.fullName
        }&background=${background.replace("#", "")}&color=${foreground.replace("#", "")}`;
      }
    };

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) console.error(err);
      Account.password = hash;
    });
    const pictureUrl = await url();

    Account.pictureUrl = pictureUrl;

    await Account.save();
    if (req.file) return unlinkSync(`tmp/${req.file.originalname}`);

    // TODO: return a token
  } else {
    return res.status(403).json({
      error: "Forbidden"
    });
  }
});

module.exports = router;
