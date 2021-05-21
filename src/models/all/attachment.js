const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Attachment = new mongoose.Schema({
  url: { type: String },
  filename: { type: String },
  post: { type: mongoose.Types.ObjectId, ref: "Post" },
});

// Plugins
Attachment.plugin(mongoosePaginate);

module.exports = mongoose.model("Attachment", Attachment);
