const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
	request: {
		from: { type: String }
	},
	type: { type: String, required: true },
	seen: { type: Boolean, default: false },
	datefield: {
		type: Date,
		default: () => {
			return new Date();
		}
	}
});

module.exports = NotificationSchema;
