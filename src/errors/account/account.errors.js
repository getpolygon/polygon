module.exports = {
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
			error: "The email you provided is already registered and cannot be assigned to your account",
			code: "duplicate_email".toUpperCase()
		},
		wrong_current_password: {
			error: "The password you provided is not the same as the password of your account",
			code: "wrong_current_password".toUpperCase()
		}
	}
};
