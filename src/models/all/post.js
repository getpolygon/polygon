const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Post = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  attachments: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Attachment" }],
    default: [],
  },
  timestamp: { type: Date, required: true, default: () => Date.now() },
});

// Plugins
Post.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", Post);
