const _ = require("lodash");
const path = require("path");
const BW = require("bad-words");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const { unlinkSync } = require("fs");
const sanitizeHtml = require("sanitize-html");
const BadWordsFilter = new BW({ placeHolder: "*" });

const MinIO = require("../../utils/minio");
const AccountSchema = require("../../models/account");

// Get all posts
exports.getAllPosts = async (req, res) => {
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

      if (accountId === undefined) {
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
      } else {
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
};

// Create a post
exports.createPost = async (req, res) => {
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

          await MinIO.client.fPutObject(MinIO.bucket, _FILEPATH, file.path, {
            "Content-Type": file.mimetype
          });
          const PresignedURL = await MinIO.client.presignedGetObject(MinIO.bucket, _FILEPATH);

          Post.attachments.push({
            url: PresignedURL.toString(),
            filename: _FILENAME.toString()
          });

          await Post.attachments.save(); // Saving because the array state does not persist
          unlinkSync(path.resolve(file.path));
        });

        AuthorAccount.posts.push(Post);

        await Post.save();
        return res.json(Post);
      }
    }
  });
};

// Delete a post
exports.deletePost = async (req, res) => {
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
            await MinIO.client.removeObject(MinIO.bucket, _FILENAME);
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
};
