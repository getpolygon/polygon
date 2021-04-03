const jwt = require("jsonwebtoken");

const { JWT_TOKEN } = process.env;
const omit = require("../../utils/omit");
const errors = require("../../errors/errors");
const AccountSchema = require("../../models/account");

exports.verify = (req, res) => {
	const { jwt: token } = req.cookies;

	if (!token) return res.json(errors.jwt.invalid_token_or_does_not_exist);
	else {
		jwt.verify(token, JWT_TOKEN, async (err, data) => {
			if (err) return res.json(errors.jwt.invalid_token_or_does_not_exist);
			else {
				const except = ["password"];
				const user = await AccountSchema.findById(data.id);

				if (user) {
					return res.json({
						userData: omit(user, except),
						code: "valid".toUpperCase()
					});
				} else return res.clearCookie("jwt").json(errors.verification.not_valid);
			}
		});
	}
};
