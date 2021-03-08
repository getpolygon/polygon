const _ = require("lodash");
const jwt = require("jsonwebtoken");

const omit = require("../../utils/omit");
const errors = require("../../errors/errors");
const AccountSchema = require("../../models/account");

exports.getAllNotifications = (req, res) => {
	jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN, async (err, data) => {
		if (err) return res.status(403).json({ error: "Forbidden" });
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
