const _ = require("lodash");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { unlinkSync } = require("fs");
const emailValidator = require("email-validator");

const minio = require("../../db/minio");
const errors = require("../../errors/errors");
const AccountSchema = require("../../models/account");
const _checkForDuplicates = require("../../helpers/checkForDuplicates");

exports.register = async (req, res) => {
	const email = _.toLower(req.body.email);
	const hasValidEmail = emailValidator.validate(email);
	const hasDuplicates = await _checkForDuplicates({ email: email }, AccountSchema);

	if (hasValidEmail) {
		if (!hasDuplicates) {
			bcrypt.genSalt(10, (err, salt) => {
				if (err) return res.json(errors.unexpected.unexpected_error);
				else if (salt) {
					bcrypt.hash(req.body.password, salt, async (err2, hash) => {
						if (err2) return res.json(errors.unexpected.unexpected_error);
						else {
							const Account = new AccountSchema({
								firstName: req.body.firstName,
								lastName: req.body.lastName,
								email: email,
								password: hash
							});

							if (req.file !== undefined) {
								await minio.client.putObject(
									minio.bucket,
									`${Account._id}/${Account._id}.png`,
									req.file.buffer,
									req.file.size,
									{
										"Content-Type": req.file.mimetype
									}
								);

								const AvatarURL = await minio.client.presignedGetObject(
									minio.bucket,
									`${Account._id}/${Account._id}.png`
								);
								Account.avatar = AvatarURL;
							} else {
								Account.avatar = `https://avatars.dicebear.com/api/initials/${Account.firstName}=${Account.lastName}.svg`;
							}

							await Account.save();

							jwt.sign({ id: Account._id }, process.env.JWT_TOKEN, (err, token) => {
								if (err) return res.json({ error: err, code: "jwt_error".toUpperCase() });
								else if (token) {
									return res
										.status(201)
										.cookie("jwt", token, {
											httpOnly: true,
											secure: true,
											sameSite: "none"
										})
										.json({
											message: "Created",
											code: "account_created".toUpperCase()
										});
								}
							});
						}
					});
				}
			});
		} else {
			return res.json(errors.registration.duplicate_account);
		}
	} else {
		return res.json(errors.registration.invalid_email);
	}
};
