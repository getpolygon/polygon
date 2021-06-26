const AccountSchema = require("./account");
const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Post = new Schema(
  {
    body: { type: String, required: true },
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
      objects: { type: [{ type: String }], default: [], required: true },
      urls: {
        type: [{ mimetype: { type: String }, url: { type: String } }],
        default: [],
        required: true,
      },
    },
    hearts: {
      count: { type: Number, default: 0, required: true },
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    timestamps: true,
  }
);

// Plugins
Post.plugin(mongoosePaginate);

// Indexing
Post.index({
  body: "text",
  comments: "text",
});

module.exports = model("Post", Post);
