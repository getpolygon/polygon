const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Notification = new mongoose.Schema({
	account: { type: mongoose.Types.ObjectId, ref: "Account" },
	// type: { type: String, required: true },
	seen: { type: Boolean, default: false },
	datefield: {
		type: Date,
		default: () => {
			return new Date();
		}
	}
});

// Plugins
Notification.plugin(mongoosePaginate);

module.exports = mongoose.model("Notification", Notification);
