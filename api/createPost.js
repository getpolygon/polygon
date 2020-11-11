require("mongoose");

// For deleting files
const { unlink } = require("fs");

const { MINIO_HOST, MINIO_PORT, MINIO_ACCKEY, MINIO_SECKEY, MINIO_USESSL } = require("../minio.config");
const minio = require("minio");
const MinIOClient = new minio.Client({
  endPoint: MINIO_HOST,
  port: MINIO_PORT,
  accessKey: MINIO_ACCKEY,
  secretKey: MINIO_SECKEY,
  useSSL: MINIO_USESSL
})

const multer = require("multer");
const storage = multer.diskStorage({
  destination: "tmp/",
  filename: (err, file, cb) => {
    cb(null, `${file.originalname.toString()}`);
    if (err) console.error(err);
  }
})
const upload = multer({ storage: storage });

const router = require("express").Router();
const { fromUnixTime, format } = require("date-fns");

const AccountSchema = require("../models/account");

router.put("/", upload.single("image"), async (req, res) => {
  let authorAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password,
  });
  let author = authorAccount.fullName;
  let authorImage = authorAccount.pictureUrl;
  let authorId = authorAccount._id;

  if (req.file) {
    // Upload user image to the database
    await MinIOClient.fPutObject("local", `${authorAccount.email}/media/${req.file.originalname}`, req.file.path, { "Content-Type": req.file.mimetype });
    // Getting the link for the user's image
    const presignedUrl = await MinIOClient.presignedGetObject("local", `${authorAccount.email}/media/${req.file.originalname}`, 24 * 60 * 60);

    const Post = {
      text: req.body.text,
      author: author,
      authorEmail: req.cookies.email,
      authorId: authorId,
      authorImage: authorImage,
      attachedImage: presignedUrl,
      datefield: Date.now(),
    };

    authorAccount.posts.push(Post);
    let post = authorAccount.posts.create(Post);

    await authorAccount
      .save()
      .then(() => {
        post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
        res.json(post);
        // Deleting the file from the drive
        unlink(`tmp/${req.file.originalname.toString()}`, (err) => {
          if (err) console.error(err);
        });
      })
      .catch(e => console.error(e));
  } else {

    const Post = {
      text: req.body.text,
      author: author,
      authorEmail: req.cookies.email,
      authorId: authorId,
      authorImage: authorImage,
      datefield: Date.now(),
    };

    authorAccount.posts.push(Post);
    let post = authorAccount.posts.create(Post);

    await authorAccount
      .save()
      .then(() => {
        post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
        res.json(post)
      })
      .catch(e => console.error(e));
  }
});

module.exports = router;
