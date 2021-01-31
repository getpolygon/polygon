const mongoose = require("mongoose");
const CommentSchema = require("./comment");

const AttachmentSchema = new mongoose.Schema({
  url: { type: String },
  filename: { type: String }
});

const PostSchema = new mongoose.Schema({
  text: { type: String, required: true },
  authorId: { type: String, required: true },
  comments: [CommentSchema],
  hearts: { type: Array, default: [] },
  attachments: { type: [AttachmentSchema], default: [] },
  datefield: { type: String, required: true, default: Date() }
});
module.exports = PostSchema;
