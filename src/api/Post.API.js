const BW = require("bad-words");
const BadWordsFilter = new BW({ placeHolder: "*" });
const sanitizeHtml = require("sanitize-html");
const linkifyUrls = require("linkify-urls");
// For deleting files
const { unlink } = require("fs");
// For displaying dates
const { fromUnixTime, format } = require("date-fns");
// MinIO Configuration
const { ENDPOINT, PORT, ACCKEY, SECKEY, USESSL } = require("../../config/minio");
const mongoose = require("mongoose");
const minio = require("minio");
const MinIOClient = new minio.Client({
  endPoint: ENDPOINT,
  port: PORT,
  accessKey: ACCKEY,
  secretKey: SECKEY,
  useSSL: USESSL
});
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "tmp/",
  filename: (err, file, cb) => {
    cb(null, `${file.originalname.toString()}`);
    if (err) console.error(err);
  }
});
const upload = multer({
  storage: storage
});
const router = require("express").Router();
const AccountSchema = require("../models/account");

// FETCH POSTS
router.get("/fetch", async (req, res) => {
  const currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
  });
  let { accountId, postId, heart, getHearts } = req.query;

  if (accountId) {
    await AccountSchema.findById(accountId)
      .then((doc) => {
        let foundPosts = [];
        doc.posts.forEach((post) => {
          post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
          foundPosts.push(post);
        });
        res.json(foundPosts);
      })
      .catch((e) => console.error(e));
  }

  if (postId && heart) {
    const postAuthor = await AccountSchema.findOne({ "posts._id": postId });

    for (let v = 0; v < postAuthor.posts.length; v++) {
      if (postAuthor.posts[v]._id != postId) {
        continue;
      } else {
        // Getting the post
        var post = postAuthor.posts[v];
        post.hearts.usersHearted.push({ accountId: currentAccount._id });
        post.hearts.numberOfHearts++;
        await postAuthor.save();
        res.json(post);
      }
    }
  }
  if (postId && getHearts) {
    const postAuthor = await AccountSchema.findOne({ "posts._id": postId });
    res.json(null);
    // TODO: There was a bug when requesting for post hearts the request sent 3 JSON responses instead of 2
  }
  // Send all the posts
  else {
    await AccountSchema.find({
      isPrivate: false
    }) // Getting posts from all the public accounts
      .where("_id") // These lines exclude current account from the query
      .ne(currentAccount._id) // These lines exclude current account from the query
      .then((doc) => {
        let foundPosts = [];
        doc.forEach((account) => {
          account.posts.forEach((post) => {
            post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
            foundPosts.push(post);
          });
        });
        /*
         * Instead finding users' posts here
         * Doing this because users' account could be private
         * By doing this they'll be able to see their posts
         */
        currentAccount.posts.forEach((post) => {
          post.datefield = format(fromUnixTime(post.datefield / 1000), "MMM d/y h:mm b");
          foundPosts.push(post);
        });
        res.json(foundPosts);
      })
      .catch((e) => console.log(e));
  }
});

// CREATE A POST
router.put("/create", upload.fields([{ name: "image" }, { name: "video" }]), async (req, res) => {
  let authorAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
  });
  let author = authorAccount.fullName;
  let authorImage = authorAccount.pictureUrl;
  let authorId = authorAccount._id;
  let { q } = req.query;

  let text =
    // Sanitizing HTML to dodge XSS attacks
    sanitizeHtml(
      // Creating an HTML link for every URL
      linkifyUrls(
        // Filtering out bad words
        BadWordsFilter.clean(req.body.text),
        // Setting some attributes for our newly created HTML
        {
          attributes: { target: "_blank" }
        }
      )
    );

  if (q == "txt") {
    const Post = {
      _id: new mongoose.Types.ObjectId(),
      text: text,
      author: author,
      authorEmail: req.cookies.email,
      authorId: authorId,
      authorImage: authorImage,
      hasAttachments: false,
      datefield: Date.now()
    };
    authorAccount.posts.push(Post);
    await authorAccount
      .save()
      .then(() => {
        Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
        res.json(Post);
      })
      .catch((e) => console.error(e));
  }

  if (q == "vid") {
    await MinIOClient.fPutObject(
      "local",
      `${authorAccount._id}/media/${req.files.video[0].originalname}`,
      req.files.video[0].path,
      {
        "Content-Type": req.files.video[0].mimetype
      }
    );
    const presignedUrl = await MinIOClient.presignedGetObject(
      "local",
      `${authorAccount._id}/media/${req.files.video[0].originalname}`
    );

    const Post = {
      _id: new mongoose.Types.ObjectId(),
      text: text,
      author: author,
      authorEmail: req.cookies.email,
      authorId: authorId,
      authorImage: authorImage,
      hasAttachments: true,
      attachments: {
        hasAttachedImage: false,
        hasAttachedVideo: true,
        video: {
          attachedVideo: presignedUrl,
          attachedVideoFileName: req.files.video[0].originalname.toString()
        }
      },
      datefield: Date.now()
    };

    authorAccount.posts.push(Post);
    await authorAccount
      .save()
      .then(() => {
        Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
        res.json(Post);
      })
      .catch((e) => console.error(e));
    unlink(`tmp/${req.files.video[0].originalname}`, (err) => {
      if (err) console.error(err);
    });
  }

  if (q == "img") {
    await MinIOClient.fPutObject(
      "local",
      `${authorAccount._id}/media/${req.files.image[0].originalname}`,
      req.files.image[0].path,
      {
        "Content-Type": req.files.image[0].mimetype
      }
    );
    const presignedUrl = await MinIOClient.presignedGetObject(
      "local",
      `${authorAccount._id}/media/${req.files.image[0].originalname}`
    );

    const Post = {
      _id: new mongoose.Types.ObjectId(),
      text: text,
      author: author,
      authorEmail: req.cookies.email,
      authorId: authorId,
      authorImage: authorImage,
      hasAttachments: true,
      attachments: {
        hasAttachedImage: true,
        hasAttachedVideo: false,
        image: {
          attachedImage: presignedUrl,
          attachedImageFileName: req.files.image[0].originalname.toString()
        }
      },
      datefield: Date.now()
    };

    authorAccount.posts.push(Post);
    await authorAccount
      .save()
      .then(() => {
        Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
        res.json(Post);
      })
      .catch((e) => console.error(e));
    unlink(`tmp/${req.files.image[0].originalname}`, (err) => {
      if (err) console.error(err);
    });
  }
  if (q == "imgvid") {
    await MinIOClient.fPutObject(
      "local",
      `${authorAccount._id}/media/${req.files.video[0].originalname}`,
      req.files.video[0].path,
      {
        "Content-Type": req.files.video[0].mimetype
      }
    );
    await MinIOClient.fPutObject(
      "local",
      `${authorAccount._id}/media/${req.files.image[0].originalname}`,
      req.files.image[0].path,
      {
        "Content-Type": req.files.image[0].mimetype
      }
    );
    const presignedUrlImage = await MinIOClient.presignedGetObject(
      "local",
      `${authorAccount._id}/media/${req.files.image[0].originalname}`
    );
    const presignedUrlVideo = await MinIOClient.presignedGetObject(
      "local",
      `${authorAccount._id}/media/${req.files.video[0].originalname}`
    );

    const Post = {
      _id: new mongoose.Types.ObjectId(),
      text: text,
      author: author,
      authorEmail: req.cookies.email,
      authorId: authorId,
      authorImage: authorImage,
      hasAttachments: true,
      attachments: {
        hasAttachedImage: true,
        hasAttachedVideo: true,
        video: {
          attachedVideo: presignedUrlVideo,
          attachedVideoFileName: req.files.video[0].originalname.toString()
        },
        image: {
          attachedImage: presignedUrlImage,
          attachedImageFileName: req.files.image[0].originalname.toString()
        }
      },
      datefield: Date.now()
    };

    authorAccount.posts.push(Post);
    await authorAccount
      .save()
      .then(() => {
        Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
        res.json(Post);
      })
      .catch((e) => console.error(e));
    unlink(`tmp/${req.files.video[0].originalname}`, (err) => {
      if (err) console.error(err);
    });
    unlink(`tmp/${req.files.image[0].originalname}`, (err) => {
      if (err) console.error(err);
    });
  }
});

// DELETE A POST
router.delete("/delete", async (req, res) => {
  let currentEmail = req.cookies.email;
  let currentPassword = req.cookies.password;
  let { post } = req.query;

  await AccountSchema.findOne({
    email: currentEmail,
    password: currentPassword
  })
    .then(async (doc) => {
      let foundPost = doc.posts.id(post);
      if (foundPost.hasAttachments == true) {
        if (foundPost.attachments.hasAttachedImage == true) {
          MinIOClient.removeObject(
            "local",
            `${currentEmail}/media/${foundPost.attachments.image.attachedImageFileName}`,
            function (err) {
              if (err) {
                return console.log("Unable to remove object", err);
              }
            }
          );
        }
        if (foundPost.attachments.hasAttachedVideo == true) {
          MinIOClient.removeObject(
            "local",
            `${currentEmail}/media/${foundPost.attachments.video.attachedVideoFileName}`,
            function (err) {
              if (err) {
                return console.log("Unable to remove object", err);
              }
            }
          );
        }
        if (
          foundPost.attachments.hasAttachedVideo == true &&
          foundPost.attachments.hasAttachedImage
        ) {
          MinIOClient.removeObject(
            "local",
            `${currentEmail}/media/${foundPost.attachments.image.attachedImageFileName}`,
            function (err) {
              if (err) {
                return console.log("Unable to remove object", err);
              }
            }
          );
          MinIOClient.removeObject(
            "local",
            `${currentEmail}/media/${foundPost.attachments.image.attachedImageFileName}`,
            function (err) {
              if (err) {
                return console.log("Unable to remove object", err);
              }
            }
          );
        }

        doc.posts.pull(foundPost);
        await doc
          .save()
          .then(
            res.json({
              result: "Removed"
            })
          )
          .catch((e) => console.error(e));
      } else {
        doc.posts.pull(foundPost);
        await doc
          .save()
          .then(
            res.json({
              result: "Removed"
            })
          )
          .catch((e) => console.error(e));
      }
    })
    .catch((e) => console.error(e));
});

module.exports = router;
