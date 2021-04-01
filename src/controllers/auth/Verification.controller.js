const jwt = require("jsonwebtoken");

const omit = require("../../utils/omit");
const errors = require("../../errors/errors");
const AccountSchema = require("../../models/account");

exports.verify = (req, res) => {
	const { JWT_TOKEN } = process.env;
	const { jwt: token } = req.cookies;

	if (!token) {
		return res.json(errors.jwt.invalid_token_or_does_not_exist);
	} else {
		jwt.verify(token, JWT_TOKEN, async (err, data) => {
			if (err)
				return res.status(403).json({
					error: err
				});
			else {
				const Except = ["password"];
				const User = await AccountSchema.findById(data.id);

				if (User) {
					return res.json({
						userData: omit(User, Except),
						code: "valid".toUpperCase()
					});
				} else {
					return res.clearCookie("jwt").json(errors.verification.not_valid);
				}
			}
		});
	}
};
