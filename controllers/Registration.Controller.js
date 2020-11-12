const minioConfig = require("../minio.config");

const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const randomness = Math.round(Math.random());
const storage = multer.diskStorage({
  destination: "tmp/",
  filename: (err, file, cb) => {
    cb(null, `${randomness}.png`);
  },
});
const upload = multer({ storage: storage });
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
const avatarLinks = [
  "/static/img/1.png",
  "/static/img/2.png",
  "/static/img/3.png",
  "/static/img/4.png",
  "/static/img/5.png",
  "/static/img/6.png",
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
  // If a custom image was selected by the client set the picture URL to Firebase's  CDN
  const url = async () => {
    // If the user has selected a file
    if (req.file) {
      // Upload user image to the database
      await MinIOClient.fPutObject(
        "local",
        `${req.body.email}/${req.body.email}.png`,
        req.file.path,
        {
          "Content-Type": req.file.mimetype,
        }
      );
      // Getting the link for the user's image
      const presignedUrl = await MinIOClient.presignedGetObject(
        "local",
        `${req.body.email}/${req.body.email}.png`
      );
      return presignedUrl;
    }
    // If the user didn't select an image return a random image link(string) that will be used to serve default avatars from the server
    else {
      return avatarLinks[Math.floor(Math.random() * avatarLinks.length)];
    }
  };

  let pictureUrl = await url();
  let email = req.body.email.toLowerCase();

  let Account = new AccountSchema({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    fullName: `${req.body.firstName} ${req.body.lastName}`,
    email: email,
    password: req.body.password,
    bio: req.body.bio,
    pictureUrl: pictureUrl,
    isPrivate: req.body.privateCheck ? true : false,
    friends: {
      pending: [],
      approved: [],
      dismissed: [],
      requested: [],
    },
    date: Date.now(),
  });

  // Delete the created file to save space
  fs.unlink(`tmp/${randomness}.png`, (err) => {
    if (err) console.error(err);
  });
  fs.unlink("tmp/0.png", (err) => {
    if (err) console.error(err);
  });

  await Account.save()
    .then(() => {
      res.cookie("email", Account.email, { maxAge: 24 * 60 * 60 * 1000 });
      res.cookie("password", Account.password, { maxAge: 24 * 60 * 60 * 1000 });
      res.redirect(`/user/${Account._id}`);
    })
    .catch((e) => {
      res.redirect("/");
      console.log(e);
    });
});

module.exports = router;
