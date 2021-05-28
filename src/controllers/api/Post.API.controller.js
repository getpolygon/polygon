const { JWT_PRIVATE_KEY } = process.env;

const BW = require("bad-words");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");
const minio = require("../../db/minio");
const sanitizeHtml = require("sanitize-html");
const BadWordsFilter = new BW({ placeHolder: "*" });
const { AccountSchema, PostSchema } = require("../../models");

// Get all posts
exports.getAllPosts = async (req, res) => {
  const posts = await PostSchema.find().where("user._id").ne(req.user._id);
  res.json(posts);
};

// Create a post
exports.createPost = async (req, res) => {
  const { user } = req;
  const text = sanitizeHtml(BadWordsFilter.clean(req.body.text));
  const post = await PostSchema.create({ text, author: user });
  await post.save();
  res.json(post);
};
// Save a post
exports.savePost = (req, res) => {};
// Edit a post
exports.editPost = async (req, res) => {};
// Heart a post
exports.heartPost = async (req, res) => {};
// Delete a post
exports.deletePost = async (req, res) => {};
// Unheart a post
exports.unheartPost = async (req, res) => {};
// Create a comment
// exports.createComment = async (req, res) => {};
