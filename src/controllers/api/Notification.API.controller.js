const _ = require("lodash");
const jwt = require("jsonwebtoken");

const { JWT_TOKEN } = process.env;
const omit = require("../../utils/omit");
// const errors = require("../../errors/errors");
// const messages = require("../../messages/messages");
const AccountSchema = require("../../models/account");

exports.getAllNotifications = (req, res) => {
	const { jwt: token } = req.cookies;

	jwt.verify(token, JWT_TOKEN, async (err, data) => {
		// TODO
		if (err) return res.json();
		else if (data) {
			const notifications = [];
			const currentAccount = await AccountSchema.findById(data.id);

			for (const notification of currentAccount.notifications) {
				if (notification.type === "incoming_friend_request".toUpperCase()) {
					const userData = await AccountSchema.findById(notification.request.from);
					const updatedNotfication = {
						notificationData: notification,
						userData: omit(userData, [
							"email",
							"password",
							"friends",
							"posts",
							"saved",
							"notifications",
							"bio"
						])
					};
					notifications.push(updatedNotfication);
				}
			}

			return res.json(notifications);
		}
	});
};
