const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  authorEmail: { type: String, required: true },
  authorId: { type: String, required: true },
  authorImage: { type: String, required: true },
  datefield: { type: String, required: true }
});

module.exports = CommentSchema;
