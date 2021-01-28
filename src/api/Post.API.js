const _ = require("lodash");
const minio = require("minio");
const BW = require("bad-words");
const jwt = require("jsonwebtoken");
const { unlinkSync } = require("fs");
const router = require("express").Router();
const sanitizeHtml = require("sanitize-html");
const BadWordsFilter = new BW({ placeHolder: "*" });
const { fromUnixTime, format } = require("date-fns");
// MinIO
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
// Multer
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

// Models
const AccountSchema = require("../models/account");

// Fetch posts and their data
router.get("/fetch", async (req, res) => {
  const { jwt: token } = req.cookies;

  jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
    if (err) {
      return res.status(403).json({
        error: err
      });
    } else {
      const { accountId } = req.query;
      const CurrentAccount = await AccountSchema.findById(data.id);
      const OtherAccounts = await AccountSchema.find().where("_id").ne(CurrentAccount._id);
      const Filter = {
        fullName: null,
        bio: null,
        pictureUrl: null,
        isPrivate: null,
        posts: null,
        date: null,
        friends: null,
        _id: null
      };

      if (!accountId) {
        const Posts = [];

        OtherAccounts.map((account) => {
          account.posts.map((post) => {
            Posts.push({
              authorData: _.pick(account, _.keys(Filter)),
              postData: post
            });
          });
        });
        return res.json(Posts);
      } else if (accountId) {
        const Posts = [];
        const FoundAccount = await AccountSchema.findById(accountId);
        FoundAccount.posts.map((post) => {
          Posts.push({
            authorData: _.pick(FoundAccount, _.keys(Filter)),
            postData: post
          });
        });
        return res.json(Posts);
      }
    }
  });

  // CREATE A POST
  router.put("/create", upload.array("attachments"), async (req, res) => {
    jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN, async (err, data) => {
      if (err) return res.json({ error: err });
      else if (data) {
        const AuthorAccount = await AccountSchema.findById(data.id);
        const PostText = sanitizeHtml(BadWordsFilter.clean(req.body.text));

        if (req.files.length === 0) {
          const Post = AuthorAccount.posts.create({
            text: PostText,
            authorId: AuthorAccount._id,
            datefield: Date()
          });

          AuthorAccount.posts.push(Post);
          await AuthorAccount.save();
          return res.json(Post);
        } else {
          // TODO: Implement media uploads with multiple files
        }
      }
    });
  });

  // if (type == "txt") {
  //   const Post = authorAccount.posts.create({
  //     text: text,
  //     author: author,
  //     authorEmail: req.session.email,
  //     authorId: authorId,
  //     authorImage: authorImage,
  //     hasAttachments: false,
  //     datefield: Date()
  //   });

  //   authorAccount.posts.push(Post);
  //   await authorAccount.save();
  //   Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
  //   res.json(Post);
  // }

  // if (type == "vid") {
  //   await MinIOClient.fPutObject(
  //     MINIO_BUCKET,
  //     `${authorAccount._id}/media/${req.files.video[0].originalname}`,
  //     req.files.video[0].path,
  //     {
  //       "Content-Type": req.files.video[0].mimetype
  //     }
  //   );
  //   const presignedUrl = await MinIOClient.presignedGetObject(
  //     MINIO_BUCKET,
  //     `${authorAccount._id}/media/${req.files.video[0].originalname}`
  //   );

  //   const Post = authorAccount.posts.create({
  //     text: text,
  //     author: author,
  //     authorEmail: req.session.email,
  //     authorId: authorId,
  //     authorImage: authorImage,
  //     hasAttachments: true,
  //     attachments: {
  //       hasAttachedImage: false,
  //       hasAttachedVideo: true,
  //       video: {
  //         attachedVideo: presignedUrl,
  //         attachedVideoFileName: req.files.video[0].originalname.toString()
  //       }
  //     },
  //     datefield: Date.now()
  //   });

  //   authorAccount.posts.push(Post);
  //   await authorAccount.save();
  //   Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
  //   res.json(Post);
  //   unlinkSync(`tmp/${req.files.video[0].originalname}`);
  // }

  // if (type == "img") {
  //   await MinIOClient.fPutObject(
  //     MINIO_BUCKET,
  //     `${authorAccount._id}/media/${req.files.image[0].originalname}`,
  //     req.files.image[0].path,
  //     {
  //       "Content-Type": req.files.image[0].mimetype
  //     }
  //   );
  //   const presignedUrl = await MinIOClient.presignedGetObject(
  //     MINIO_BUCKET,
  //     `${authorAccount._id}/media/${req.files.image[0].originalname}`
  //   );

  //   const Post = authorAccount.posts.create({
  //     text: text,
  //     author: author,
  //     authorEmail: req.session.email,
  //     authorId: authorId,
  //     authorImage: authorImage,
  //     hasAttachments: true,
  //     attachments: {
  //       hasAttachedImage: true,
  //       hasAttachedVideo: false,
  //       image: {
  //         attachedImage: presignedUrl,
  //         attachedImageFileName: req.files.image[0].originalname.toString()
  //       }
  //     },
  //     datefield: Date.now()
  //   });

  //   authorAccount.posts.push(Post);
  //   await authorAccount.save();
  //   Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
  //   unlinkSync(`tmp/${req.files.image[0].originalname}`);
  //   res.json(Post);
  // }
  // if (type == "imgvid") {
  //   await MinIOClient.fPutObject(
  //     MINIO_BUCKET,
  //     `${authorAccount._id}/media/${req.files.video[0].originalname}`,
  //     req.files.video[0].path,
  //     {
  //       "Content-Type": req.files.video[0].mimetype
  //     }
  //   );
  //   await MinIOClient.fPutObject(
  //     MINIO_BUCKET,
  //     `${authorAccount._id}/media/${req.files.image[0].originalname}`,
  //     req.files.image[0].path,
  //     {
  //       "Content-Type": req.files.image[0].mimetype
  //     }
  //   );
  //   const presignedUrlImage = await MinIOClient.presignedGetObject(
  //     MINIO_BUCKET,
  //     `${authorAccount._id}/media/${req.files.image[0].originalname}`
  //   );
  //   const presignedUrlVideo = await MinIOClient.presignedGetObject(
  //     MINIO_BUCKET,
  //     `${authorAccount._id}/media/${req.files.video[0].originalname}`
  //   );

  //   const Post = authorAccount.posts.create({
  //     text: text,
  //     author: author,
  //     authorEmail: req.session.email,
  //     authorId: authorId,
  //     authorImage: authorImage,
  //     hasAttachments: true,
  //     attachments: {
  //       hasAttachedImage: true,
  //       hasAttachedVideo: true,
  //       video: {
  //         attachedVideo: presignedUrlVideo,
  //         attachedVideoFileName: req.files.video[0].originalname.toString()
  //       },
  //       image: {
  //         attachedImage: presignedUrlImage,
  //         attachedImageFileName: req.files.image[0].originalname.toString()
  //       }
  //     },
  //     datefield: Date.now()
  //   });

  //   authorAccount.posts.push(Post);
  //   await authorAccount.save();
  //   Post.datefield = format(fromUnixTime(Post.datefield / 1000), "MMM d/y h:mm b");
  //   res.json(Post);
  // unlinkSync(`tmp/${req.files.video[0].originalname}`);
  // unlinkSync(`tmp/${req.files.image[0].originalname}`);
  // }
});

// DELETE A POST
router.delete("/delete", async (req, res) => {
  const { post } = req.query;
  const CurrentAccount = await AccountSchema.findOne({
    email: req.session.email,
    password: req.session.password
  });

  let foundPost = CurrentAccount.posts.id(post);
  if (foundPost.hasAttachments == true) {
    if (foundPost.attachments.hasAttachedImage == true) {
      MinIOClient.removeObject(
        MINIO_BUCKET,
        `${CurrentAccount._id}/media/${foundPost.attachments.image.attachedImageFileName}`,
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
        `${CurrentAccount._id}/media/${foundPost.attachments.video.attachedVideoFileName}`,
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
        `${CurrentAccount._id}/media/${foundPost.attachments.image.attachedImageFileName}`,
        function (err) {
          if (err) {
            return console.log("Unable to remove object", err);
          }
        }
      );
      MinIOClient.removeObject(
        MINIO_BUCKET,
        `${CurrentAccount._id}/media/${foundPost.attachments.image.attachedImageFileName}`,
        function (err) {
          if (err) {
            return console.log("Unable to remove object", err);
          }
        }
      );
    }

    CurrentAccount.posts.pull(foundPost);
    res.json({
      result: "Removed"
    });
    await CurrentAccount.save();
  } else {
    CurrentAccount.posts.pull(foundPost);
    res.json({
      result: "Removed"
    });
    await CurrentAccount.save();
  }
});

module.exports = router;
