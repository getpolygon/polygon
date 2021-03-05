const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
	type: { type: String, required: true },
	message: { type: String, required: true },
	seen: { type: Boolean, default: false },
	datefield: { type: Number, default: Date.now() }
});

module.exports = NotificationSchema;
