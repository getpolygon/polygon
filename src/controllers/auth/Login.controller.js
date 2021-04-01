const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const errors = require("../../errors/errors");
const AccountSchema = require("../../models/account");

exports.login = async (req, res) => {
	const { password } = req.body;
	const email = _.toLower(req.body.email);

	if (email && password) {
		const Account = await AccountSchema.findOne({ email: email });
		if (Account) {
			bcrypt.compare(password, Account.password, (err, _same) => {
				if (err) {
					return res.json(errors.account.wrong_password);
				} else {
					jwt.sign(
						{ id: Account._id },
						process.env.JWT_TOKEN,
						// ! TODO: Set token expiration date
						// { expiresIn: "1h" },
						(err, token) => {
							if (err) {
								return res.json(errors.unexpected.unexpected_error);
							} else {
								return res
									.cookie("jwt", token, {
										httpOnly: true,
										secure: true,
										sameSite: "none"
									})
									.json({
										token: token
									});
							}
						}
					);
				}
			});
		} else {
			return res.json(errors.account.does_not_exist);
		}
	} else {
		return res.json(errors.fields.missing_fields);
	}
};
