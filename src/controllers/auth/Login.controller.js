const { JWT_TOKEN } = process.env;

const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");

const AccountSchema = require("../../models/account");

exports.login = async (req, res) => {
	const { password } = req.body;
	const email = _.toLower(req.body.email);

	if (emailValidator.validate(email) && password) {
		const Account = await AccountSchema.findOne({ email: email });

		if (Account) {
			const same = await bcrypt.compare(password, Account.password);

			if (same) {
				jwt.sign(
					{ id: Account._id },
					JWT_TOKEN,
					{
						expiresIn: "1h"
					},
					(err, token) => {
						if (err) return res.status(403).json(err);
						else {
							return res
								.status(200)
								.cookie("jwt", token, {
									httpOnly: true,
									secure: true,
									sameSite: "none"
								})
								.json(token);
						}
					}
				);
			} else {
				return res.status(403).json({
					// TODO
				});
			}
		} else {
			return res.status(404).json({
				// TODO
			});
		}
	} else {
		return res.status(422).json({
			// TODO
		});
	}
};
