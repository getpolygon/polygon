const mongoose = require("mongoose");
const CommentSchema = require("./comment");

// The user's ID that liked the post
const userHeartedSchema = new mongoose.Schema({
  accountId: { type: String, required: true }
});

const PostSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  authorEmail: { type: String, required: true },
  authorId: { type: String, required: true },
  authorImage: { type: String, required: true },
  comments: [CommentSchema],
  hearts: {
    usersHearted: [userHeartedSchema],
    numberOfHearts: { type: Number, default: 0 }
  },
  hasAttachments: Boolean,
  attachments: {
    hasAttachedImage: Boolean,
    hasAttachedVideo: Boolean,
    image: {
      attachedImage: { type: String },
      attachedImageFileName: { type: String }
    },
    video: {
      attachedVideo: { type: String },
      attachedVideoFileName: { type: String }
    }
  },
  datefield: { type: String, required: true }
});
module.exports = PostSchema;
