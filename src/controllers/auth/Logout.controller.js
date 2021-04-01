const messages = require("../../messages/messages");

exports.logout = (_, res) => {
	return res.clearCookie("jwt").json(messages.logout.successful);
};
