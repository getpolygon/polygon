const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema({
	url: { type: String },
	filename: { type: String }
});

module.exports = AttachmentSchema;
