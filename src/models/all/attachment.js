const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Attachment = new mongoose.Schema({
  url: { type: String, required: true },
  name: { type: String, required: true },
  post: { type: mongoose.Types.ObjectId, ref: "Post", required: true },
});

// Plugins
Attachment.plugin(mongoosePaginate);

module.exports = mongoose.model("Attachment", Attachment);
