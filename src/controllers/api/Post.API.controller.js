const _ = require("lodash");
const path = require("path");
const BW = require("bad-words");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { unlinkSync } = require("fs");
const sanitizeHtml = require("sanitize-html");
const BadWordsFilter = new BW({ placeHolder: "*" });

const MinIO = require("../../db/minio");
const omit = require("../../utils/omit");
const errors = require("../../errors/errors");
const AccountSchema = require("../../models/account");

// Get all posts
exports.getAllPosts = async (req, res) => {
	const { page, limit } = req.query;
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) {
			return res.json(errors.jwt.invalid_token_or_does_not_exist);
		} else {
			const { accountId } = req.query;
			const Exclude = ["email", "password"];
			const OtherAccounts = await AccountSchema.find().where("_id").ne(data.id);

			if (!accountId) {
				const posts = [];

				for (const account in OtherAccounts) {
					for (const post in account.posts) {
						const _post = {};
						_post.authorData = omit(account, Exclude);
						_post.postData = post;

						for (const comment in post.comments) {
							const _comment = {};
							_comment.commentData = comment;
							_comment.authorData = omit(await AccountSchema.findById(comment.authorId), Exclude);
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
						const CurrentAccount = await AccountSchema.findById(data.id);

						for (const post of foundAccount.posts) {
							const _post = {};
							_post.postData = post;
							_post.authorData = omit(CurrentAccount, Exclude.concat(["posts"]));

							for (const comment of _post.postData.comments) {
								const _comment = {};
								_comment.commentData = comment;
								_comment.authorData = omit(await AccountSchema.findById(comment.authorId), Exclude);
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
			const AuthorAccount = await AccountSchema.findById(data.id);
			const PostText = sanitizeHtml(BadWordsFilter.clean(req.body.text));

			if (req.files.length === 0) {
				const Post = AuthorAccount.posts.create({
					text: PostText,
					authorId: AuthorAccount._id
				});

				AuthorAccount.posts.push(Post);
				await AuthorAccount.save();

				return res.json(Post);
			} else {
				const Post = AuthorAccount.posts.create({
					text: PostText,
					authorId: AuthorAccount._id
				});

				for (const file of req.files) {
					const _FILENAME_ = uniqid(); // Generating a unique filename
					const _FILEPATH_ = `${AuthorAccount._id}/media/${_FILENAME_}`;

					await MinIO.client.fPutObject(MinIO.bucket, _FILEPATH_, file.path, {
						"Content-Type": file.mimetype
					});
					const PresignedURL = await MinIO.client.presignedGetObject(MinIO.bucket, _FILEPATH_);

					const _ATTACHMENT_ = {};
					_ATTACHMENT_.url = PresignedURL;
					_ATTACHMENT_.filename = _FILENAME_;

					Post.attachments.push(_ATTACHMENT_);
					unlinkSync(path.resolve(file.path));
				}

				AuthorAccount.posts.push(Post);
				await AuthorAccount.save();
				return res.json(Post);
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
		} else if (data) {
			const CurrentAccount = await AccountSchema.findById(data.id);
			const FoundPost = CurrentAccount.posts.id(postId);

			if (!FoundPost) {
				return res.json({
					message: "Does not exist"
				});
			} else {
				if (FoundPost.attachments.length !== 0 && FoundPost.attachments !== null) {
					_.forEach(FoundPost.attachments, async (obj) => {
						const _FILENAME = CurrentAccount._id + "/media/" + obj.filename;
						await MinIO.client.removeObject(MinIO.bucket, _FILENAME);
					});
				}

				CurrentAccount.posts.pull(FoundPost);
				await CurrentAccount.save();
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
	const PostAuthor = await AccountSchema.findOne({ "posts._id": postId });
	const Post = PostAuthor.posts.id(postId);

	if (Post === null) {
		return res.json({
			error: "Post does not exist"
		});
	} else {
		jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
			if (err) {
				return res.status(403).json({
					error: err
				});
			} else if (data) {
				if (Post.hearts.includes(data.id)) {
					return res.json({
						message: "Already hearted"
					});
				} else {
					Post.hearts.push(data.id);
					await PostAuthor.save();
					return res.json({
						message: "Hearted"
					});
				}
			}
		});
	}
};

exports.unheartPost = async (req, res) => {
	const { postId } = req.query;
	const { jwt: token } = req.cookies;
	const PostAuthor = await AccountSchema.findOne({ "posts._id": postId });
	const Post = PostAuthor.posts.id(postId);

	if (Post === null) {
		return res.json({
			error: "Post does not exist"
		});
	} else {
		jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
			if (err) {
				res.status(403).json({
					error: err
				});
			} else if (data) {
				if (Post.hearts.includes(data.id)) {
					Post.hearts.pull(data.id);
					await PostAuthor.save();
					return res.json({
						message: "Unhearted"
					});
				} else {
					return res.json({
						message: "Already unhearted"
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
		if (err) return res.status(500).json({ error: err });
		else {
			const PostAuthor = await AccountSchema.findOne({ "posts._id": postId });
			const Post = await PostAuthor.posts.id(postId);

			if (Post === null) {
				return res.status(404).json({
					error: "Post not found"
				});
			} else {
				if (Post.authorId === data.id) {
					Post.text = text;
					Post.datefield = Date();
					await PostAuthor.save();
					return res.json({
						message: "Updated"
					});
				} else {
					return res.status(403).json({
						error: "Forbidden"
					});
				}
			}
		}
	});
};

exports.createComment = async (req, res) => {
	const { postId } = req.query;
	const { comment } = req.body;
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err)
			return res.status(500).json({
				error: err
			});
		else {
			const PostAuthor = await AccountSchema.findOne({ "posts._id": postId });
			const CurrentAccount = await AccountSchema.findById(data.id);
			const Post = PostAuthor.posts.id(postId);
			const PAYLOAD = {
				comment: comment,
				authorId: CurrentAccount._id
			};
			Post.comments.push(Post.comments.create(PAYLOAD));
			await PostAuthor.save();
			return res.json({
				message: "Commented"
			});
		}
	});
};

exports.savePost = (req, res) => {
	const { postId } = req.query;
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) return res.status(500).json({ error: err });
		else {
			const CurrentAccount = await AccountSchema.findOne({ _id: data.id });
			if (CurrentAccount !== null) {
				const Save = CurrentAccount.saved.create({ postId: postId });
				CurrentAccount.saved.push(Save);
				await CurrentAccount.save();

				return res.json({ message: "Saved" });
			} else {
				return res.json({ error: "Account does not exist" });
			}
		}
	});
};
