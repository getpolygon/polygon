const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Post = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  comments: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    default: [],
    required: true,
  },
  attachments: {
    urls: { type: [{ type: String }], default: [], required: true },
    objects: { type: [{ type: String }], default: [], required: true },
  },
  timestamp: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
});

// Plugins
Post.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", Post);
