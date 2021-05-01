const jwt = require("jsonwebtoken");

const { JWT_TOKEN } = process.env;
const { promisify } = require("util");
const AccountSchema = require("../../models/account");

exports.verify = (req, res) => {
	const { jwt: token } = req.cookies;

	if (!token) return res.status(403).json(token);
	else {
		jwt.verify(token, JWT_TOKEN, async (err, data) => {
			if (err) return res.status(403).json(err);
			else {
				const user = await AccountSchema.findById(
					data.id
					// { password: 0 }
				);

				if (user) return res.status(200).json(true);
				else return res.status(403).clearCookie("jwt").json(false);
			}
		});
	}
};
