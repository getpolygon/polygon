const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Post = new Schema(
  {
    text: { type: String, required: true },
    private: { type: Boolean, required: true, default: false },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
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
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

// Plugins
Post.plugin(mongoosePaginate);

module.exports = model("Post", Post);
