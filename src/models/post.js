const mongoose = require("mongoose");
const CommentSchema = require("./comment");

// The user's ID that liked the post
const HeartsSchema = new mongoose.Schema({
  accountId: { type: String, required: true }
});

const AttachmentSchema = new mongoose.Schema({
  url: { type: String },
  filename: { type: String }
});

const PostSchema = new mongoose.Schema({
  text: { type: String, required: true },
  authorId: { type: String, required: true },
  comments: [CommentSchema],
  hearts: [HeartsSchema],
  attachments: { type: [AttachmentSchema], default: [] },
  datefield: { type: String, required: true, default: Date() }
});
module.exports = PostSchema;
