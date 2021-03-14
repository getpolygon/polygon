module.exports = {
	account: {
		does_not_exist: {
			error: "The account that you specified does not exist",
			code: "no_account".toUpperCase()
		},
		invalid_id: {
			error: "The id you specified is not valid",
			code: "invalid_account_id".toUpperCase()
		},
		wrong_password: {
			error: "Your password is invalid",
			code: "wrong_password".toUpperCase()
		},
		update: {
			empty_body: {
				error: "Noting was given in the body to update",
				code: "empty_body".toUpperCase()
			},
			duplicate_email: {
				error:
					"The email you provided is already registered and cannot be assigned to your account",
				code: "duplicate_email".toUpperCase()
			},
			wrong_current_password: {
				error: "The password you provided is not the same as the password of your account",
				code: "wrong_current_password".toUpperCase()
			}
		}
	},
	fields: {
		missing_fields: {
			error: "There are missing fields in your form",
			code: "missing_fields".toUpperCase()
		}
	},
	friend: {
		no_fr_account_id_spec: {
			error: "You didn't specify the account id to send a friend request to",
			code: "no_id".toUpperCase()
		},
		outgoing_account_does_not_exist: {
			error: "The account that you're trying to send a friend request does not exist",
			code: "nonexistent_other_account".toUpperCase()
		},
		both_accounts_do_not_exist: {
			error: "None of these accounts exist",
			error: "nonexistent_accounts".toUpperCase()
		}
	},
	jwt: {
		invalid_token_or_does_not_exist: {
			error: "Your jwt token is either invalid or does not exist in your cookies",
			code: "no_jwt".toUpperCase()
		}
	},
	verification: {
		not_valid: {
			error: "You will be logged out because your token is not valid",
			code: "not_valid".toUpperCase()
		}
	},
	network: {
		status_get_error_no_account_id_provided: {
			error: "No account id was provided",
			code: "no_id".toUpperCase()
		}
	},
	unexpected: {
		unexpected_error: {
			error: "There was an unexpected error",
			code: "unexpected_error".toUpperCase()
		}
	},
	registration: {
		duplicate_account: {
			error: "There's an account with that email",
			code: "duplicate_account".toUpperCase()
		},
		invalid_email: {
			error: "Invalid email",
			code: "invalid_email".toUpperCase()
		}
	},
	post: {
		does_not_exist: {
			error: "Post does not exist",
			code: "no_post".toUpperCase()
		}
	},
	search: {
		no_query: {
			error: "No query was provided",
			code: "no_query".toUpperCase()
		}
	}
};
