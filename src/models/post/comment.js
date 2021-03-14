const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
	comment: { type: String, required: true },
	authorId: { type: String, required: true },
	datefield: {
		type: Date,
		required: true,
		default: () => {
			return new Date();
		}
	}
});

module.exports = CommentSchema;
