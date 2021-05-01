const { JWT_TOKEN } = process.env;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const minio = require("../../db/minio");
const AccountSchema = require("../../models/account");
const checkForDuplicates = require("../../helpers/checkForDuplicates");

exports.fetchAccount = async (req, res) => {
	const { accountId } = req.query;
	const { jwt: token } = req.cookies;

	if (!accountId) {
		return jwt.verify(token, JWT_TOKEN, async (err, data) => {
			if (err) return res.status(403).json(err);
			else {
				if (mongoose.Types.ObjectId.isValid(data.id)) {
					const account = await AccountSchema.findById(data.id, {
						datefield: 0,
						password: 0,
						posts: 0
					});

					// No such account
					if (!account) {
						return res.status(404).json({
							// TODO
						});
					} else return res.json(account);
				} else {
					// Invalid ID
					return res.status(400).json({
						// TODO
					});
				}
			}
		});
	} else {
		if (mongoose.Types.ObjectId.isValid(accountId)) {
			const account = await AccountSchema.findById(
				accountId,
				// Excluding these fields
				{ email: 0, password: 0, posts: 0 }
			);
			if (!account) {
				return res.status(404).json({
					//TODO
				});
			} else return res.status(200).json(account);
		} else {
			return res.status(400).json({
				// TODO
			});
		}
	}
};

exports.deleteAccount = async (req, res) => {
	const { jwt: token } = req.cookies;

	jwt.verify(token, JWT_TOKEN, async (err, data) => {
		if (err) {
			// TODO
			// return res.json(errors.jwt.invalid_token_or_does_not_exist);
		} else {
			if (mongoose.Types.ObjectId.isValid(data.id)) {
				const files = [];
				const objectStream = minio.client.listObjectsV2(
					minio.bucket,
					// Directory of current account
					data.id + "/",
					true
				);

				// Pushing every object to a file array
				objectStream.on("data", (obj) => files.push(obj.name));
				// Then deleting every file from the file array
				objectStream.on("end", async () => await minio.client.removeObjects(minio.bucket, files));

				// Deleteing the account from MongoDB
				await AccountSchema.findByIdAndDelete(data.id);

				return res.clearCookie("jwt");
				// .json(messages.account.actions.delete);
			} else {
				// return res.json(errors.account.invalid_id);
			}
		}
	});
};

// TODO
exports.updateAccount = async (req, res) => {
	const { jwt: token } = req.cookies;
	const { email, password, bio } = req.body;

	jwt.verify(token, JWT_TOKEN, async (err, data) => {
		if (err) {
			// return res.json(errors.jwt.invalid_token_or_does_not_exist);
		} else {
			if (mongoose.Types.ObjectId.isValid(data.id)) {
				const account = await AccountSchema.findById(data.id);
				if (!account) {
					// return res.json(errors.account.does_not_exist);
				} else {
					if (bio) account.bio = bio;
					if (email) {
						const hasDuplicates = await checkForDuplicates({ email }, AccountSchema);
						if (!hasDuplicates) account.email = email;
					}
					if (password) {
						bcrypt.genSalt(10, (err, salt) => {
							if (err) {
								// TODO
								// console.error(err);
							} else {
								bcrypt.hash(password, salt, (err, hash) => {
									if (err) {
										// TODO
										// console.error(err);
									} else account.password = hash;
								});
							}
						});
					}

					await account.save();

					// TODO: Implement a warning system for untouched properties like email
					// return res.json(messages.account.actions.update);
				}
			} else {
				// return res.json(errors.account.invalid_id);
			}
		}
	});
};
