const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");

const CommentSchema = require("./comment");
const AttachmentSchema = require("./attachment");

const PostSchema = new mongoose.Schema({
	comments: [CommentSchema],
	attachments: [AttachmentSchema],
	hearts: { type: Array, default: [] },
	text: { type: String, required: true },
	authorId: { type: String, required: true },
	datefield: { type: String, required: true, default: Date() }
});

// PostSchema.plugin(mongoosePaginate);

module.exports = PostSchema;
