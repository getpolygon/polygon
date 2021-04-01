module.exports = {
	logout: {
		successful: {
			message: "Logged out",
			code: "logged_out".toUpperCase()
		}
	},
	register: {
		successful: {
			message: "Account created",
			code: "account_created".toUpperCase()
		}
	},
	post: {
		actions: {
			heart: {
				hearted: {
					message: "Post hearted",
					code: "hearted".toUpperCase()
				},
				alreadyHearted: {
					message: "This post is already hearted",
					code: "already_hearted".toUpperCase()
				}
			},
			unheart: {
				unhearted: {
					message: "Unhearted the post",
					code: "unhearted"
				},
				alreadyUnhearted: {
					message: "This post is already unhearted",
					code: "already_unhearted"
				}
			},
			update: {
				updated: {
					message: "Updated the post",
					code: "updated_post".toUpperCase()
				},
				forbidden: {
					error: "You do not have the permission to perform this action",
					code: "forbidden".toUpperCase()
				}
			},
			comment: {
				created: {
					message: "Comment created",
					code: "comment_created".toUpperCase()
				},
				deleted: {
					// TODO
				}
			},
			save: {
				saved: {
					message: "Post was saved",
					code: "post_saved".toUpperCase()
				}
			},
			delete: {
				deleted: {
					message: "Post was deleted",
					code: "post_deleted".toUpperCase()
				}
			}
		}
	}
};
