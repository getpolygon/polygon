const BW = require("bad-words");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const BadWordsFilter = new BW({ placeHolder: "*" });

const minio = require("../../db/minio");
const omit = require("../../utils/omit");
const errors = require("../../errors/errors");
const messages = require("../../messages/messages");
const AccountSchema = require("../../models/account");

// Get all posts
exports.getAllPosts = async (req, res) => {
	const { jwt: token } = req.cookies;
	// const { limit, page } = req.params;

	// const query = {
	// 	page,
	// 	limit
	// };

	// TODO: Experiment with this
	// AccountSchema.paginate({ populate: "posts" }, query, (err, result) => {

	// });

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) return res.json(errors.jwt.invalid_token_or_does_not_exist);
		else {
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
		if (err) return res.json(errors.jwt.invalid_token_or_does_not_exist);
		else {
			const exclude = ["email", "password"];
			const authorAccount = await AccountSchema.findById(data.id);
			const sanitizedPostText = sanitizeHtml(BadWordsFilter.clean(req.body.text));

			if (req.files.length === 0) {
				const foundPost = authorAccount.posts.create({
					text: sanitizedPostText,
					authorId: authorAccount._id
				});

				authorAccount.posts.push(foundPost);
				await authorAccount.save();

				return res.json({ postData: foundPost, authorData: omit(authorAccount, exclude) });
			} else {
				const foundPost = authorAccount.posts.create({
					text: sanitizedPostText,
					authorId: authorAccount._id
				});

				for (const file of req.files) {
					// Generating a unique filename
					const _FILENAME_ = uniqid();
					// File path in MinIO
					const _FILEPATH_ = `${authorAccount._id}/media/${_FILENAME_}`;
					// Uploading to MinIO
					await minio.client.putObject(minio.bucket, _FILEPATH_, file.buffer, file.size, {
						"Content-Type": file.mimetype
					});
					// Generating a presigned URL
					const _URL_ = await minio.client.presignedGetObject(minio.bucket, _FILEPATH_);
					const _ATTACHMENT_ = foundPost.attachments.create({
						url: _URL_,
						filename: _FILENAME_
					});

					foundPost.attachments.push(_ATTACHMENT_);
				}

				authorAccount.posts.push(foundPost);
				await authorAccount.save();
				return res.json({ postData: foundPost, authorData: omit(authorAccount, exclude) });
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

			if (!foundPost) return res.json(errors.post.does_not_exist);
			else {
				for (const obj of foundPost.attachments) {
					const _FILEPATH_ = `${currentAccount._id}/media/${obj.filename}`;
					await minio.client.removeObject(minio.bucket, _FILEPATH_);
				}

				currentAccount.posts.pull(foundPost);
				await currentAccount.save();
				return res.json(messages.post.actions.delete.deleted);
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
					return res.json(messages.post.actions.heart.alreadyHearted);
				} else {
					foundPost.hearts.push(data.id);
					await postAuthor.save();
					return res.json(messages.post.actions.heart.hearted);
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

	if (!foundPost) return res.json(errors.post.does_not_exist);
	else {
		jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
			if (err) res.json(errors.jwt.invalid_token_or_does_not_exist);
			else {
				if (foundPost.hearts.includes(data.id)) {
					foundPost.hearts.pull(data.id);
					await postAuthor.save();
					return res.json(messages.post.actions.unheart.unhearted);
				} else return res.json(messages.post.actions.unheart.alreadyUnhearted);
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

			if (!foundPost) return res.json(errors.post.does_not_exist);
			else {
				if (foundPost.authorId === data.id) {
					const sanitizedPostText = sanitizeHtml(BadWordsFilter.clean(text));
					foundPost.text = sanitizedPostText;
					await postAuthor.save();
					return res.json(messages.post.actions.update.updated);
				} else return res.json(messages.post.actions.update.forbidden);
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
			return res.json(messages.post.actions.comment.created);
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

				return res.json(messages.post.actions.save.saved);
			} else return res.json(errors.account.does_not_exist);
		}
	});
};
