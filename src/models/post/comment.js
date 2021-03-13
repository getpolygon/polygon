const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
	comment: { type: String, required: true },
	authorId: { type: String, required: true },
	datefield: { type: Number, required: true, default: Date.now() }
});

module.exports = CommentSchema;
