const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const minio = require("../../db/minio");
const omit = require("../../utils/omit");
const errors = require("../../errors/errors");
const AccountSchema = require("../../models/account");
const checkForDuplicates = require("../../helpers/checkForDuplicates");

const { JWT_TOKEN } = process.env;

exports.fetchAccount = async (req, res) => {
	const { accountId } = req.query;
	const { jwt: token } = req.cookies;

	if (!accountId) {
		// Filter for current account
		const Exclude = ["password"];

		return jwt.verify(token, JWT_TOKEN, async (error, data) => {
			if (error) {
				return res.json(errors.jwt.invalid_token_or_does_not_exist);
			} else if (data) {
				if (mongoose.Types.ObjectId.isValid(data.id)) {
					const foundAccount = await AccountSchema.findById(data.id);
					if (!foundAccount) {
						return res.json(errors.account.does_not_exist);
					} else {
						const payload = omit(foundAccount, Exclude);
						return res.json(payload);
					}
				} else {
					return res.json(errors.account.invalid_id);
				}
			}
		});
	} else {
		if (mongoose.Types.ObjectId.isValid(accountId)) {
			// Filter for other accounts
			const Exclude = ["password", "email"];
			const foundAccount = await AccountSchema.findById(accountId);

			if (!foundAccount) {
				return res.json(errors.account.doesnt_exist);
			} else {
				const payload = omit(foundAccount, Exclude);
				return res.json(payload);
			}
		} else {
			return res.json(errors.account.invalid_id);
		}
	}
};

exports.deleteAccount = async (req, res) => {
	// For deleting the account
	const { jwt: token } = req.cookies;

	jwt.verify(token, JWT_TOKEN, async (err, data) => {
		if (err) {
			return res.json(errors.jwt.invalid_token_or_does_not_exist);
		} else if (data) {
			if (mongoose.Types.ObjectId.isValid(data.id)) {
				const _FILES_ = [];
				const ObjectStream = minio.client.listObjectsV2(
					minio.bucket,
					// Directory of current account
					data.id + "/",
					true
				);

				// Pushing every object to a file array
				ObjectStream.on("data", (obj) => _FILES_.push(obj.name));
				// Then deleting every file from the file array
				ObjectStream.on("end", async () => {
					await minio.client.removeObjects(minio.bucket, _FILES_);
				});

				// Deleteing the account from MongoDB
				await AccountSchema.findByIdAndDelete(data.id);

				return res.clearCookie("jwt").json({
					message: "Deleted"
				});
			} else {
				return res.json(errors.account.invalid_id);
			}
		}
	});
};

exports.updateAccount = async (req, res) => {
	const { jwt: token } = req.cookies;
	const { email, password, bio } = req.body;

	if (!email && !password && !bio) {
		return res.json(errors.account.update.empty_body);
	} else {
		jwt.verify(token, JWT_TOKEN, async (err, data) => {
			if (err) return res.json(errors.jwt.invalid_token_or_does_not_exist);
			else {
				if (mongoose.Types.ObjectId.isValid(data.id)) {
					const currentAccount = await AccountSchema.findById(data.id);

					if (!currentAccount) {
						return res.json(errors.account.does_not_exist);
					} else {
						// ! TODO: Update the way of updating the account
						if (email && password) {
							const hasDuplicates = await checkForDuplicates({ email: email }, AccountSchema);

							if (hasDuplicates) {
								return res.json(errors.account.update.duplicate_email);
							} else {
								bcrypt.compare(password, currentAccount.password, async (err, same) => {
									if (err) return res.json(errors.unexpected.unexpected_error);
									else {
										if (same) {
											currentAccount.email = _.toLower(email);
											await currentAccount.save();
											return res.json({
												message: "Updated",
												code: "updated".toUpperCase()
											});
										} else {
											return res.json(errors.account.update.wrong_current_password);
										}
									}
								});
							}
						}
					}
				} else {
					return res.json(errors.account.invalid_id);
				}
			}
		});
	}
};
