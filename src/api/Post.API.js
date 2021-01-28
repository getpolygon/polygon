const _ = require("lodash");
const path = require("path");
const minio = require("minio");
const BW = require("bad-words");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const { unlinkSync } = require("fs");
const router = require("express").Router();
const sanitizeHtml = require("sanitize-html");
const BadWordsFilter = new BW({ placeHolder: "*" });
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
  filename: (_err, file, cb) => {
    cb(null, `${file.originalname.toString()}`);
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
            authorId: AuthorAccount._id
          });

          AuthorAccount.posts.push(Post);
          await AuthorAccount.save();

          return res.json(Post);
        } else {
          const Post = AuthorAccount.posts.create({
            text: PostText,
            authorId: AuthorAccount._id
          });

          req.files.map(async (file) => {
            const _FILENAME = uniqid(); // Generating a unique filename
            const _FILEPATH = `${AuthorAccount._id}/media/${_FILENAME}`;

            await MinIOClient.fPutObject(MINIO_BUCKET, _FILEPATH, file.path, {
              "Content-Type": file.mimetype
            });
            const PresignedURL = await MinIOClient.presignedGetObject(MINIO_BUCKET, _FILEPATH);

            Post.attachments.push({
              url: PresignedURL.toString(),
              filename: _FILENAME.toString()
            });

            await AuthorAccount.save(); // Saving because the array state does not persist
            unlinkSync(path.resolve(file.path));
          });

          AuthorAccount.posts.push(Post);

          await AuthorAccount.save();
          return res.json(Post);
        }
      }
    });
  });
});

// DELETE A POST
router.delete("/delete", async (req, res) => {
  const { postId } = req.query;
  const { jwt: token } = req.cookies;

  jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
    if (err) {
      return res.json({
        error: err
      });
    } else if (data) {
      const CurrentAccount = await AccountSchema.findById(data.id);
      const FoundPost = CurrentAccount.posts.id(postId);

      if (!FoundPost) {
        return res.json({
          message: "Does not exist"
        });
      } else {
        if (FoundPost.attachments.length !== 0 && FoundPost.attachments !== null) {
          _.forEach(FoundPost.attachments, async (obj) => {
            const _FILENAME = CurrentAccount._id + "/media/" + obj.filename;
            await MinIOClient.removeObject(MINIO_BUCKET, _FILENAME);
          });
        }

        CurrentAccount.posts.pull(FoundPost);
        await CurrentAccount.save();
        return res.json({
          result: "Removed"
        });
      }
    }
  });
});

module.exports = router;
