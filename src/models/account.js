const mongoose = require("mongoose");

const SavedSchema = require("./saved");
const FriendSchema = require("./friend");
const PostSchema = require("./post/post");
const NotificationSchema = require("./notification");

const AccountSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	fullName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true, minlength: 8 },
	bio: { type: String, required: false },
	pictureUrl: { type: String, required: true },
	isPrivate: { type: Boolean, required: true },
	friends: {
		// The FRs that are awaiting the approval of this user
		pending: { type: [FriendSchema], default: [] },
		// The FSs that are friends with this user
		approved: { type: [FriendSchema], default: [] },
		// The FRs that this user send
		requested: { type: [FriendSchema], default: [] }
	},
	notifications: [NotificationSchema],
	posts: [PostSchema],
	saved: [SavedSchema],
	datefield: { type: Number, required: true, default: Date.now() }
});

module.exports = mongoose.model("Account", AccountSchema);
