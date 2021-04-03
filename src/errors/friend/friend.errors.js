module.exports = {
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
};
