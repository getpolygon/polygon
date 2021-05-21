const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Comment = new mongoose.Schema({
  post: { type: mongoose.Types.ObjectId, ref: "Post" },
  content: { type: String, required: true },
  datefield: {
    type: Date,
    required: true,
    default: () => {
      return new Date();
    },
  },
});

// Plugins
Comment.plugin(mongoosePaginate);

module.exports = mongoose.model("Comment", Comment);
