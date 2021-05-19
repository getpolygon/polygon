const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Friend = new mongoose.Schema({
	addedAt: { type: Date, required: true },
	account: { type: mongoose.Types.ObjectId, ref: "Account" }
});

// Plugins
Friend.plugin(mongoosePaginate());

module.exports = mongoose.model("Friend", Friend);
