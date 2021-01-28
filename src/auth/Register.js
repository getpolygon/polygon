const _ = require("lodash");
const path = require("path");
const minio = require("minio");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { unlinkSync } = require("fs");
const router = require("express").Router();
const emailValidator = require("email-validator");
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
  filename: (_err, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

const AccountSchema = require("../models/account");
const _checkForDuplicates = require("../helpers/checkForDuplicates");

router.post("/", upload.single("avatar"), async (req, res) => {
  const email = _.toLower(req.body.email);
  const hasValidEmail = emailValidator.validate(email);
  const hasDuplicates = await _checkForDuplicates({ email: email }, AccountSchema);

  if (hasValidEmail) {
    if (!hasDuplicates) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.error(err);
        else if (salt) {
          bcrypt.hash(req.body.password, salt, async (err, hash) => {
            if (err) console.error(err);
            else if (hash) {
              const Account = new AccountSchema({
                _id: new mongoose.Types.ObjectId(),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                fullName: `${req.body.firstName} ${req.body.lastName}`,
                email: email,
                bio: req.body.bio,
                password: hash,
                isPrivate: req.body.privateCheck ? true : false
              });

              if (req.file) {
                MinIOClient.fPutObject(
                  MINIO_BUCKET,
                  `${Account._id}/${Account._id}.png`,
                  req.file.path,
                  {
                    "Content-Type": req.file.mimetype
                  }
                );
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
              jwt.sign({ id: Account._id }, process.env.JWT_TOKEN, (err, token) => {
                if (err) console.log(err);
                else if (token) {
                  return res
                    .status(201)
                    .cookie("jwt", token, {
                      httpOnly: true
                    })
                    .json({
                      message: "Account Created"
                    });
                }
              });
            }
          });
        }
      });
    } else {
      return res.json({
        error: "Forbidden"
      });
    }
  } else {
    return res.json({
      error: "Invalid email"
    });
  }
});

module.exports = router;
