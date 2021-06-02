const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Comment = new Schema(
  {
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    timestamp: { type: Date, required: true, default: () => Date.now() },
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
Comment.plugin(mongoosePaginate);

module.exports = model("Comment", Comment);
