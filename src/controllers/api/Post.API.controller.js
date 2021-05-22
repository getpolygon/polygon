const { JWT_PRIVATE_KEY } = process.env;

const BW = require("bad-words");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const minio = require("../../db/minio");
const sanitizeHtml = require("sanitize-html");
const BadWordsFilter = new BW({ placeHolder: "*" });
const AccountSchema = require("../../models/all/account");

// Get all posts
export const getAllPosts = async (req, res) => {
  const { jwt: token } = req.cookies;

  jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
    if (err) {
      return res.json({ err });
    } else {
      // const { accountId } = req.query;
      const otherAccounts = await AccountSchema.find(
        {},
        { email: 0, password: 0 }
      );
      // .where("_id")
      // .ne(data.id);

      return res.json(otherAccounts);
    }
  });
};

// Create a post
export const createPost = async (req, res) => {
  const { jwt: token } = req.cookies;

  jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
    if (err) {
      // return res.json(errors.jwt.invalid_token_or_does_not_exist);
    } else {
      const exclude = ["email", "password", "posts"];
      const authorAccount = await AccountSchema.findById(data.id);
      const sanitizedPostText = sanitizeHtml(
        BadWordsFilter.clean(req.body.text)
      );

      if (req.files.length === 0) {
        const foundPost = authorAccount.posts.create({
          text: sanitizedPostText,
          authorId: authorAccount._id,
        });

        authorAccount.posts.push(foundPost);
        await authorAccount.save();

        return res.json({
          postData: foundPost,
          authorData: {
            // TODO
          },
        });
      } else {
        const foundPost = authorAccount.posts.create({
          text: sanitizedPostText,
          authorId: authorAccount._id,
        });

        for (const file of req.files) {
          // Generating a unique filename
          const _FILENAME_ = uniqid();
          // File path in MinIO
          const _FILEPATH_ = `${authorAccount._id}/media/${_FILENAME_}`;
          // Uploading to MinIO
          await minio.client.putObject(
            minio.bucket,
            _FILEPATH_,
            file.buffer,
            file.size,
            {
              "Content-Type": file.mimetype,
            }
          );
          // Generating a presigned URL
          const _URL_ = await minio.client.presignedGetObject(
            minio.bucket,
            _FILEPATH_
          );
          const _ATTACHMENT_ = foundPost.attachments.create({
            url: _URL_,
            filename: _FILENAME_,
          });

          foundPost.attachments.push(_ATTACHMENT_);
        }

        authorAccount.posts.push(foundPost);
        await authorAccount.save();
        return res.json({
          postData: foundPost,
          authorData: omit(authorAccount, exclude),
        });
      }
    }
  });
};

// Delete a post
export const deletePost = async (req, res) => {
  const { postId } = req.query;
  const { jwt: token } = req.cookies;

  jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
    if (err) {
      // TODO
    } else {
      // TODO
    }
  });
};

export const heartPost = async (req, res) => {
  const { postId } = req.query;
  const { jwt: token } = req.cookies;

  const postAuthor = await AccountSchema.findOne({ "posts._id": postId });
  const foundPost = postAuthor.posts.id(postId);

  if (!foundPost) {
    // return res.json(errors.post.does_not_exist);
  } else {
    jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
      if (err) {
        // return res.json(errors.jwt.invalid_token_or_does_not_exist);
      } else {
        if (foundPost.hearts.includes(data.id)) {
          // return res.json(messages.post.actions.heart.alreadyHearted);
        } else {
          foundPost.hearts.push(data.id);
          await postAuthor.save();
          // return res.json(messages.post.actions.heart.hearted);
        }
      }
    });
  }
};

export const unheartPost = async (req, res) => {
  const { postId } = req.query;
  const { jwt: token } = req.cookies;

  const postAuthor = await AccountSchema.findOne({ "posts._id": postId });
  const foundPost = postAuthor.posts.id(postId);

  if (!foundPost) {
    // return res.json(errors.post.does_not_exist);
  } else {
    jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
      if (err) {
        // return res.json(errors.jwt.invalid_token_or_does_not_exist);
      } else {
        if (foundPost.hearts.includes(data.id)) {
          foundPost.hearts.pull(data.id);
          await postAuthor.save();
          // return res.json(messages.post.actions.unheart.unhearted);
        } else {
          // return res.json(messages.post.actions.unheart.alreadyUnhearted);
        }
      }
    });
  }
};

export const editPost = async (req, res) => {
  const { text } = req.body;
  const { postId } = req.query;
  const { jwt: token } = req.cookies;

  jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
    if (err) {
      // return res.json(errors.jwt.invalid_token_or_does_not_exist);
    } else {
      const postAuthor = await AccountSchema.findOne({ "posts._id": postId });
      const foundPost = await postAuthor.posts.id(postId);

      if (!foundPost) {
        // return res.json(errors.post.does_not_exist);
      } else {
        if (foundPost.authorId === data.id) {
          const sanitizedPostText = sanitizeHtml(BadWordsFilter.clean(text));
          foundPost.text = sanitizedPostText;
          await postAuthor.save();
          // return res.json(messages.post.actions.update.updated);
        } else {
          // return res.json(messages.post.actions.update.forbidden);
        }
      }
    }
  });
};

export const createComment = async (req, res) => {
  const { postId } = req.query;
  const { jwt: token } = req.cookies;

  jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
    if (err) {
      // return res.json(errors.jwt.invalid_token_or_does_not_exist);
    } else {
      const postAuthor = await AccountSchema.findOne({ "posts._id": postId });
      const currentAccount = await AccountSchema.findById(data.id);
      const foundPost = postAuthor.posts.id(postId);
      const sanitizedComment = sanitizeHtml(
        BadWordsFilter.clean(req.body.comment)
      );
      const comment = foundPost.comments.create({
        comment: sanitizedComment,
        authorId: currentAccount._id,
      });
      foundPost.comments.push(comment);
      await postAuthor.save();
      // return res.json(messages.post.actions.comment.created);
    }
  });
};

export const savePost = (req, res) => {
  const { postId } = req.query;
  const { jwt: token } = req.cookies;

  jwt.verify(token, JWT_PRIVATE_KEYS, async (err, data) => {
    if (err) {
      // return res.json(errors.jwt.invalid_token_or_does_not_exist);
    } else {
      const currentAccount = await AccountSchema.findOne({ _id: data.id });
      if (currentAccount) {
        const Save = currentAccount.saved.create({ postId: postId });
        currentAccount.saved.push(Save);
        await currentAccount.save();

        // return res.json(messages.post.actions.save.saved);
      } else {
        // return res.json(errors.account.does_not_exist);
      }
    }
  });
};
