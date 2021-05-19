const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Post = new mongoose.Schema({
	text: { type: String, required: true },
	datefield: { type: Date, required: true },
	comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
	attachments: [{ type: mongoose.Types.ObjectId, ref: "Attachment" }]
});

// Plugins
Post.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", Post);
