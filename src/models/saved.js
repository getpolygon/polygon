const mongoose = require("mongoose");

const SavedSchema = new mongoose.Schema({
  postId: { type: String, required: true }
});

module.exports = SavedSchema;
