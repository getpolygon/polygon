const BW = require("bad-words");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const BadWordsFilter = new BW({ placeHolder: "*" });

const minio = require("../../db/minio");
const omit = require("../../utils/omit");
const errors = require("../../errors/errors");
const AccountSchema = require("../../models/account");

// Get all posts
exports.getAllPosts = async (req, res) => {
	// const { page, limit } = req.query;
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) {
			return res.json(errors.jwt.invalid_token_or_does_not_exist);
		} else {
			const { accountId } = req.query;
			const exclude = ["email", "password"];
			const otherAccounts = await AccountSchema.find().where("_id").ne(data.id);

			if (!accountId) {
				const posts = [];

				for (const account in otherAccounts) {
					for (const post in account.posts) {
						const _post = {};
						_post.authorData = omit(account, exclude);
						_post.postData = post;

						for (const comment in post.comments) {
							const _comment = {};
							_comment.commentData = comment;
							_comment.authorData = omit(await AccountSchema.findById(comment.authorId), exclude);
							_post.postData.comments[_post.postData.comments.indexOf(comment)] = _comment;
						}

						posts.push(_post);
					}
				}
				return res.json(posts);
			} else {
				if (mongoose.Types.ObjectId.isValid(accountId)) {
					const foundAccount = await AccountSchema.findById(accountId);

					if (!foundAccount) {
						return res.json(errors.account.does_not_exist);
					} else {
						const posts = [];
						const currentAccount = await AccountSchema.findById(data.id);

						for (const post of foundAccount.posts) {
							const _post = {};
							_post.postData = post;
							_post.authorData = omit(currentAccount, exclude.concat(["posts"]));

							for (const comment of _post.postData.comments) {
								const _comment = {};
								_comment.commentData = comment;
								_comment.authorData = omit(await AccountSchema.findById(comment.authorId), exclude);
								_post.postData.comments[_post.postData.comments.indexOf(comment)] = _comment;
							}

							posts.push(_post);
						}

						return res.json(posts);
					}
				} else {
					return res.json(errors.account.invalid_id);
				}
			}
		}
	});
};

// Create a post
exports.createPost = async (req, res) => {
	jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN, async (err, data) => {
		if (err) return res.json({ error: err });
		else if (data) {
			const authorAccount = await AccountSchema.findById(data.id);
			const sanitizedPostText = sanitizeHtml(BadWordsFilter.clean(req.body.text));

			if (req.files.length === 0) {
				const foundPost = authorAccount.posts.create({
					text: sanitizedPostText,
					authorId: authorAccount._id
				});

				authorAccount.posts.push(foundPost);
				await authorAccount.save();

				return res.json(foundPost);
			} else {
				const foundPost = authorAccount.posts.create({
					text: sanitizedPostText,
					authorId: authorAccount._id
				});

				for (const file of req.files) {
					const _FILENAME_ = uniqid(); // Generating a unique filename
					const _FILEPATH_ = `${authorAccount._id}/media/${_FILENAME_}`; // File path in MinIO

					// Uploading to MinIO
					await minio.client.putObject(minio.bucket, _FILEPATH_, file.buffer, file.size, {
						"Content-Type": file.mimetype
					});

					const PresignedURL = await minio.client.presignedGetObject(minio.bucket, _FILEPATH_);

					const _ATTACHMENT_ = {};
					_ATTACHMENT_.url = PresignedURL;
					_ATTACHMENT_.filename = _FILENAME_;

					foundPost.attachments.push(_ATTACHMENT_);
				}

				authorAccount.posts.push(foundPost);
				await authorAccount.save();
				return res.json(foundPost);
			}
		}
	});
};

// Delete a post
exports.deletePost = async (req, res) => {
	const { postId } = req.query;
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) {
			return res.json({
				error: err
			});
		} else {
			const currentAccount = await AccountSchema.findById(data.id);
			const foundPost = currentAccount.posts.id(postId);

			if (!foundPost) {
				return res.json({
					message: "Does not exist"
				});
			} else {
				for (const obj of foundPost.attachments) {
					const _FILEPATH_ = currentAccount._id + "/media/" + obj.filename;
					await minio.client.removeObject(minio.bucket, _FILEPATH_);
				}

				currentAccount.posts.pull(foundPost);
				await currentAccount.save();
				return res.json({
					result: "Removed"
				});
			}
		}
	});
};

exports.heartPost = async (req, res) => {
	const { postId } = req.query;
	const { jwt: token } = req.cookies;

	const postAuthor = await AccountSchema.findOne({ "posts._id": postId });
	const foundPost = postAuthor.posts.id(postId);

	if (!foundPost) return res.json(errors.post.does_not_exist);
	else {
		jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
			if (err) return res.json(errors.jwt.invalid_token_or_does_not_exist);
			else {
				if (foundPost.hearts.includes(data.id)) {
					return res.json({
						message: "This post is already hearted",
						code: "already_hearted".toUpperCase()
					});
				} else {
					foundPost.hearts.push(data.id);
					await postAuthor.save();
					return res.json({
						message: "Hearted the post",
						code: "hearted".toUpperCase()
					});
				}
			}
		});
	}
};

exports.unheartPost = async (req, res) => {
	const { postId } = req.query;
	const { jwt: token } = req.cookies;

	const postAuthor = await AccountSchema.findOne({ "posts._id": postId });
	const foundPost = postAuthor.posts.id(postId);

	if (!foundPost) {
		return res.json({
			error: "foundPost does not exist"
		});
	} else {
		jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
			if (err) res.json(errors.jwt.invalid_token_or_does_not_exist);
			else {
				if (foundPost.hearts.includes(data.id)) {
					foundPost.hearts.pull(data.id);
					await postAuthor.save();
					return res.json({
						message: "Unhearted the post",
						code: "unhearted".toUpperCase()
					});
				} else {
					return res.json({
						message: "This post is already unhearted",
						code: "already_unhearted".toUpperCase()
					});
				}
			}
		});
	}
};

exports.editPost = async (req, res) => {
	const { text } = req.body;
	const { postId } = req.query;
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) return res.json(errors.jwt.invalid_token_or_does_not_exist);
		else {
			const postAuthor = await AccountSchema.findOne({ "posts._id": postId });
			const foundPost = await postAuthor.posts.id(postId);

			if (!foundPost) {
				return res.json(errors.post.does_not_exist);
			} else {
				if (foundPost.authorId === data.id) {
					const sanitizedPostText = sanitizeHtml(BadWordsFilter.clean(text));
					foundPost.text = sanitizedPostText;

					await postAuthor.save();
					return res.json({
						message: "Updated the post",
						code: "updated_post".toUpperCase()
					});
				} else {
					return res.json({
						error: "You do not have the permission to perform this action",
						code: "forbidden".toUpperCase()
					});
				}
			}
		}
	});
};

exports.createComment = async (req, res) => {
	const { postId } = req.query;
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) return res.json(errors.jwt.invalid_token_or_does_not_exist);
		else {
			const postAuthor = await AccountSchema.findOne({ "posts._id": postId });
			const currentAccount = await AccountSchema.findById(data.id);
			const foundPost = postAuthor.posts.id(postId);
			const sanitizedComment = sanitizeHtml(BadWordsFilter.clean(req.body.comment));
			const comment = foundPost.comments.create({
				comment: sanitizedComment,
				authorId: currentAccount._id
			});

			foundPost.comments.push(comment);
			await postAuthor.save();

			return res.json({
				message: "Comment posted",
				code: "comment_posted".toUpperCase()
			});
		}
	});
};

exports.savePost = (req, res) => {
	const { postId } = req.query;
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) return res.json(errors.jwt.invalid_token_or_does_not_exist);
		else {
			const currentAccount = await AccountSchema.findOne({ _id: data.id });
			if (currentAccount) {
				const Save = currentAccount.saved.create({ postId: postId });
				currentAccount.saved.push(Save);
				await currentAccount.save();

				return res.json({ message: "Saved" });
			} else {
				return res.json({ error: "Account does not exist" });
			}
		}
	});
};
