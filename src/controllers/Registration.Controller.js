const { ENDPOINT, PORT, ACCKEY, SECKEY, USESSL } = require("../../config/minio");
// const mailer = require("../helpers/mailer");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");
const router = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { unlinkSync } = require("fs");
const storage = multer.diskStorage({
  destination: "tmp/",
  filename: (err, file, cb) => {
    cb(null, `${file.originalname}`);
    if (err) return;
  }
});
const upload = multer({ storage: storage });
const minio = require("minio");
const MinIOClient = new minio.Client({
  endPoint: ENDPOINT,
  port: PORT,
  accessKey: ACCKEY,
  secretKey: SECKEY,
  useSSL: USESSL
});
const AccountSchema = require("../models/account");
const avatarLinks = [
  "/static/img/1.png",
  "/static/img/2.png",
  "/static/img/3.png",
  "/static/img/4.png",
  "/static/img/5.png",
  "/static/img/6.png"
];

// Registration Page
router.get("/", (req, res) => {
  if (!req.cookies.email & !req.cookies.password) {
    res.clearCookie("email");
    res.clearCookie("password");
    res.render("register", { title: "Register | ArmSocial" });
  } else {
    res.redirect("/auth/register");
  }
});

// To register the account
router.post("/", upload.single("avatar"), async (req, res) => {
  let email = _.lowerCase(req.body.email);

  // Checking if the email is valid
  async function checkEmailValidity() {
    if (emailValidator.validate(email)) return email;
    else return false;
  }

  async function checkForDuplicates() {
    const doc = await AccountSchema.findOne({ email: email });
    if (!doc) return false;
    else return true;
  }

  var emailIsValid = await checkEmailValidity();
  var duplicates = await checkForDuplicates();

  if (emailIsValid && !duplicates) {
    let Account = new AccountSchema({
      _id: new mongoose.Types.ObjectId(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      fullName: `${req.body.firstName} ${req.body.lastName}`,
      email: email,
      bio: req.body.bio,
      // pictureUrl: pictureUrl,
      isPrivate: req.body.privateCheck ? true : false,
      friends: {
        pending: [],
        approved: [],
        dismissed: [],
        requested: []
      },
      date: Date.now()
    });

    // If a custom image was selected by the client set the picture URL to Firebase's  CDN
    const url = async () => {
      // If the user has selected a file
      if (req.file /*&& req.file.originalname !== undefined*/) {
        // Upload user image to the database
        await MinIOClient.fPutObject("local", `${Account._id}/${Account._id}.png`, req.file.path, {
          "Content-Type": req.file.mimetype
        });
        // Getting the link for the user's image
        const presignedUrl = await MinIOClient.presignedGetObject(
          "local",
          `${Account._id}/${Account._id}.png`
        );
        return presignedUrl;
      }
      // If the user didn't select an image return a random image link(string) that will be used to serve default avatars from the server
      else {
        return avatarLinks[Math.floor(Math.random() * avatarLinks.length)];
      }
    };

    const hashPass = async () => {
      let pass = await bcrypt.hash(req.body.password, 10).catch((e) => {
        console.error(e);
      });
      return pass;
    };

    const password = await hashPass();
    const pictureUrl = await url();
    Account.pictureUrl = pictureUrl;
    Account.password = password;

    try {
      await Account.save();
      unlinkSync(`tmp/${req.file.originalname}`);
      return res
        .cookie("email", Account.email, { maxAge: 24 * 60 * 60 * 1000 })
        .cookie("password", Account.password, { maxAge: 24 * 60 * 60 * 1000 })
        .redirect(`/user/${Account._id}`);
    } catch (err) {
      res.redirect("/");
      console.log(err);
    }
  } else {
    return res.render("login", {
      title: "Login — ArmSocial",
      err: "The email you entered is invalid"
    });
  }
});

module.exports = router;
