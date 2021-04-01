const mongoose = require("mongoose");

const SavedSchema = require("./saved");
const FriendSchema = require("./friend");
const PostSchema = require("./post/post");
const NotificationSchema = require("./notification");
const mongoosePaginate = require("mongoose-paginate-v2");

const AccountSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true, minlength: 8 },
	bio: { type: String, required: false, default: "" },
	avatar: { type: String, required: true },
	isPrivate: { type: Boolean, required: true, default: false },
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
	datefield: {
		type: Date,
		required: true,
		default: () => {
			return new Date();
		}
	},
	roles: {
		verified: { type: Boolean, default: false },
		teamMember: { type: Boolean, default: false }
	}
});

AccountSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Account", AccountSchema);
