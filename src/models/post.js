const mongoose = require("mongoose");
const CommentSchema = require("./comment");

const AttachmentSchema = new mongoose.Schema({
  url: { type: String },
  filename: { type: String }
});

const PostSchema = new mongoose.Schema({
  comments: [CommentSchema],
  attachments: [AttachmentSchema],
  hearts: { type: Array, default: [] },
  text: { type: String, required: true },
  authorId: { type: String, required: true },
  datefield: { type: String, required: true, default: Date() }
});

module.exports = PostSchema;
