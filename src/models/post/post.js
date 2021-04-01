const mongoose = require("mongoose");

const CommentSchema = require("./comment");
const AttachmentSchema = require("./attachment");

const PostSchema = new mongoose.Schema({
	comments: [CommentSchema],
	attachments: [AttachmentSchema],
	hearts: { type: Array, default: [] },
	text: { type: String, required: true },
	authorId: { type: String, required: true },
	datefield: {
		type: Date,
		required: true,
		default: () => {
			return new Date();
		}
	}
});

module.exports = PostSchema;
