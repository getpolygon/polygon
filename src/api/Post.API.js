const _ = require("lodash");
const BW = require("bad-words");
const jwt = require("jsonwebtoken");
const BadWordsFilter = new BW({ placeHolder: "*" });
const sanitizeHtml = require("sanitize-html");
const linkifyUrls = require("linkify-urls");
// For deleting files
const { unlinkSync } = require("fs");
// For displaying dates
const { fromUnixTime, format } = require("date-fns");
// MinIO Configuration
const {
  MINIO_ENDPOINT,
  MINIO_BUCKET,
  MINIO_PORT,
  MINIO_ACCKEY,
  MINIO_SECKEY,
  MINIO_USESSL
} = process.env;
const minio = require("minio");
const MinIOClient = new minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: parseInt(MINIO_PORT),
  accessKey: MINIO_ACCKEY,
  secretKey: MINIO_SECKEY,
  useSSL: JSON.parse(MINIO_USESSL.toLowerCase())
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

// Fetch posts and their data
router.get("/fetch", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Bearer ....token....
  const { accountId, postId, heart, getHearts } = req.query;
  jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
    if (err)
      return res.status(403).json({
        error: "Forbidden"
      });
    const currentAccount = await AccountSchema.findOne({
      email: data.email,
      password: data.password
    });
    // Getting the posts from the specified account ID
    if (accountId) {
      let account = await AccountSchema.findById(accountId);
      let posts = account.posts;

      _.each(posts, async (post) => {
        post.datefield = format(fromUnixTime((await post.datefield) / 1000), "MMM d/y h:mm b");
      });

      return res.json(posts);
    }

    // Update the hearts of the post
    if (postId && heart) {
      // Author document of the post
      let postAuthor = await AccountSchema.findOne({ "posts._id": postId });
      // The post
      let post = postAuthor.posts.id(postId);
      // Checking if current account hearted the post
      let currentAccountHeartedThePost;

      // For checking if the post has any data or is empty
      if (post.hearts.usersHearted.length === 0) {
        currentAccountHeartedThePost = false;
      } else {
        _.each(post.hearts.usersHearted, (user) => {
          if (user.accountId == currentAccount._id) currentAccountHeartedThePost = true;
          else currentAccountHeartedThePost = false;
        });
      }

      // If current account liked the post
      if (currentAccountHeartedThePost) {
        return _.each(post.hearts.usersHearted, async (user) => {
          if (user.accountId == currentAccount.id) {
            post.hearts.numberOfHearts--;
            post.hearts.usersHearted.pull(user);
            await postAuthor.save();
            return res.json({ info: "UNHEARTED", data: post.hearts });
          }
        });
      } else {
        post.hearts.numberOfHearts++;
        post.hearts.usersHearted.push({ accountId: currentAccount._id });
        await postAuthor.save();
        return res.json({ info: "HEARTED", data: post.hearts });
      }
    }
    // Getting the hearts from the post
    if (postId && getHearts) {
      let postAuthor = await AccountSchema.findOne({ "posts._id": postId });
      let post = postAuthor.posts.id(postId);
      let hasCurrentAccount;

      _.each(post.hearts.usersHearted, (user) => {
        if (user.accountId == currentAccount.id) {
          hasCurrentAccount = true;
        } else {
          hasCurrentAccount = false;
        }
      });

      if (hasCurrentAccount === true) {
        res.json({ info: "ALREADY_HEARTED", data: post.hearts });
      } else {
        res.json({ info: "OK", data: post.hearts });
      }
    } else {
      let posts = [];
      let datefieldUpdate = (datefield) => {
        return format(fromUnixTime(datefield / 1000), "MMM d/y h:mm b");
      };
      let otherAccounts = await AccountSchema.find({ isPrivate: false })
        .where("_id")
        .ne(currentAccount.id);

      _.each(otherAccounts, (account) => {
        _.each(account.posts, (post) => {
          post.datefield = datefieldUpdate(post.datefield);
          posts.push(post);
        });
      });

      _.each(currentAccount.posts, (post) => {
        post.datefield = datefieldUpdate(post.datefield);
        posts.push(post);
      });

      _.each(posts, (post) => {
        if (post.authorId == currentAccount._id) {
          post.isCurrentAccount = true;
        } else {
          post.isCurrentAccount = false;
        }
      });

      // Sorting posts by datefield ( from latest to oldest )
      posts = _.sortBy(posts, ["datefield"]).reverse();
      res.json(posts);
    }
  });
});

// CREATE A POST
router.put("/create", upload.fields([{ name: "image" }, { name: "video" }]), async (req, res) => {
  let authorAccount = await AccountSchema.findOne({
    email: req.session.email,
    password: req.session.password
  });
  let author = authorAccount.fullName;
  let authorImage = authorAccount.pictureUrl;
  let authorId = authorAccount._id;
  let { type } = req.query;

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

  if (type == "txt") {
    const Post = authorAccount.posts.create({
      text: text,
      author: author,
      authorEmail: req.session.email,
      authorId: authorId,
      authorImage: authorImage,
      hasAttachments: false,
      datefield: Date.now()
    });

    authorAccount.posts.push(Post);
    await authorAccount.save();
    Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
    res.json(Post);
  }

  if (type == "vid") {
    await MinIOClient.fPutObject(
      MINIO_BUCKET,
      `${authorAccount._id}/media/${req.files.video[0].originalname}`,
      req.files.video[0].path,
      {
        "Content-Type": req.files.video[0].mimetype
      }
    );
    const presignedUrl = await MinIOClient.presignedGetObject(
      MINIO_BUCKET,
      `${authorAccount._id}/media/${req.files.video[0].originalname}`
    );

    const Post = authorAccount.posts.create({
      text: text,
      author: author,
      authorEmail: req.session.email,
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
    });

    authorAccount.posts.push(Post);
    await authorAccount.save();
    Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
    res.json(Post);
    unlinkSync(`tmp/${req.files.video[0].originalname}`);
  }

  if (type == "img") {
    await MinIOClient.fPutObject(
      MINIO_BUCKET,
      `${authorAccount._id}/media/${req.files.image[0].originalname}`,
      req.files.image[0].path,
      {
        "Content-Type": req.files.image[0].mimetype
      }
    );
    const presignedUrl = await MinIOClient.presignedGetObject(
      MINIO_BUCKET,
      `${authorAccount._id}/media/${req.files.image[0].originalname}`
    );

    const Post = authorAccount.posts.create({
      text: text,
      author: author,
      authorEmail: req.session.email,
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
    });

    authorAccount.posts.push(Post);
    await authorAccount.save();
    Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
    unlinkSync(`tmp/${req.files.image[0].originalname}`);
    res.json(Post);
  }
  if (type == "imgvid") {
    await MinIOClient.fPutObject(
      MINIO_BUCKET,
      `${authorAccount._id}/media/${req.files.video[0].originalname}`,
      req.files.video[0].path,
      {
        "Content-Type": req.files.video[0].mimetype
      }
    );
    await MinIOClient.fPutObject(
      MINIO_BUCKET,
      `${authorAccount._id}/media/${req.files.image[0].originalname}`,
      req.files.image[0].path,
      {
        "Content-Type": req.files.image[0].mimetype
      }
    );
    const presignedUrlImage = await MinIOClient.presignedGetObject(
      MINIO_BUCKET,
      `${authorAccount._id}/media/${req.files.image[0].originalname}`
    );
    const presignedUrlVideo = await MinIOClient.presignedGetObject(
      MINIO_BUCKET,
      `${authorAccount._id}/media/${req.files.video[0].originalname}`
    );

    const Post = authorAccount.posts.create({
      text: text,
      author: author,
      authorEmail: req.session.email,
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
    });

    authorAccount.posts.push(Post);
    await authorAccount.save();
    Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
    res.json(Post);
    unlinkSync(`tmp/${req.files.video[0].originalname}`);
    unlinkSync(`tmp/${req.files.image[0].originalname}`);
  }
});

// DELETE A POST
router.delete("/delete", async (req, res) => {
  const { post } = req.query;
  const currentAccount = await AccountSchema.findOne({
    email: req.session.email,
    password: req.session.password
  });

  let foundPost = currentAccount.posts.id(post);
  if (foundPost.hasAttachments == true) {
    if (foundPost.attachments.hasAttachedImage == true) {
      MinIOClient.removeObject(
        MINIO_BUCKET,
        `${currentAccount._id}/media/${foundPost.attachments.image.attachedImageFileName}`,
        function (err) {
          if (err) {
            return console.log("Unable to remove object", err);
          }
        }
      );
    }
    if (foundPost.attachments.hasAttachedVideo == true) {
      MinIOClient.removeObject(
        MINIO_BUCKET,
        `${currentAccount._id}/media/${foundPost.attachments.video.attachedVideoFileName}`,
        function (err) {
          if (err) {
            return console.log("Unable to remove object", err);
          }
        }
      );
    }
    if (foundPost.attachments.hasAttachedVideo == true && foundPost.attachments.hasAttachedImage) {
      MinIOClient.removeObject(
        MINIO_BUCKET,
        `${currentAccount._id}/media/${foundPost.attachments.image.attachedImageFileName}`,
        function (err) {
          if (err) {
            return console.log("Unable to remove object", err);
          }
        }
      );
      MinIOClient.removeObject(
        MINIO_BUCKET,
        `${currentAccount._id}/media/${foundPost.attachments.image.attachedImageFileName}`,
        function (err) {
          if (err) {
            return console.log("Unable to remove object", err);
          }
        }
      );
    }

    currentAccount.posts.pull(foundPost);
    res.json({
      result: "Removed"
    });
    await currentAccount.save();
  } else {
    currentAccount.posts.pull(foundPost);
    res.json({
      result: "Removed"
    });
    await currentAccount.save();
  }
});

module.exports = router;
