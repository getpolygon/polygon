const _ = require("lodash");
const jwt = require("jsonwebtoken");
const AccountSchema = require("../../models/account");

exports.verify = (req, res) => {
	const { JWT_TOKEN } = process.env;
	const { jwt: token } = req.cookies;

	if (!token) {
		return res.status(200).json({
			error: "No token"
		});
	} else {
		jwt.verify(token, JWT_TOKEN, async (err, data) => {
			if (err) {
				return res.status(403).json({
					error: err
				});
			} else if (data) {
				const User = await AccountSchema.findById(data.id);

				const Except = ["password"];

				if (User !== null) {
					return res.status(200).json(_.omit(User, Except));
				} else {
					return res.status(200).clearCookie("jwt").json({
						error: false
					});
				}
			}
		});
	}
};
