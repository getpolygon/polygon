const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  authorId: { type: String, required: true },
  datefield: { type: String, required: true, default: Date() }
});

module.exports = CommentSchema;
