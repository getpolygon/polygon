const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
	request: {
		from: { type: String }
	},
	type: { type: String, required: true },
	seen: { type: Boolean, default: false },
	datefield: { type: Number, default: Date.now() }
});

module.exports = NotificationSchema;
