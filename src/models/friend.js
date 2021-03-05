const mongoose = require("mongoose");
const FriendSchema = new mongoose.Schema({
	accountId: { type: String }
});

module.exports = FriendSchema;
