const _ = require("lodash");
const jwt = require("jsonwebtoken");

const AccountSchema = require("../../models/account");

exports.addFriend = async (req, res) => {
	const { accountId } = req.query;
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) return res.json({ error: err });
		else {
			if (!accountId) {
				return res.json({
					error: "You didn't specify the account id to send a friend request to",
					code: "no_id".toUpperCase()
				});
			} else {
				const currentAccount = await AccountSchema.findById(data.id);
				const addedAccount = await AccountSchema.findById(accountId);

				// If current account does not exist
				if (!currentAccount) {
					return res.json({
						error: "Your account is invalid or does not exist",
						code: "nonexistent_current_account".toUpperCase()
					});
				}
				// If other account does not exist
				else if (!addedAccount) {
					return res.json({
						error: "The account that you're trying to send a friend request does not exist",
						code: "nonexistent_other_account".toUpperCase()
					});
				}
				// If both accounts don't exist
				else if (!currentAccount && !addedAccount) {
					return res.json({
						error: "None of these accounts exist",
						error: "nonexistent_accounts".toUpperCase()
					});
				}
				// If both exist
				else {
					// An object to check if added account exists in one of the friend states of current account
					const addedIncludesCurrentAccountIn = {
						approved: !_.isUndefined(
							_.find(addedAccount.friends.approved, {
								accountId: currentAccount._id
							})
						),
						requested: !_.isUndefined(
							_.find(addedAccount.friends.requested, {
								accountId: currentAccount._id
							})
						),
						pending: !_.isUndefined(
							_.find(addedAccount.friends.pending, {
								accountId: currentAccount._id
							})
						)
					};

					// An object to check if current account exists in one of the friend states of added account
					const currentIncludesAddedAccountIn = {
						approved: !_.isUndefined(
							_.find(currentAccount.friends.approved, {
								accountId: addedAccount._id
							})
						),
						pending: !_.isUndefined(
							_.find(currentAccount.friends.pending, {
								accountId: addedAccount._id
							})
						)
					};

					// If they're friends already
					if (addedIncludesCurrentAccountIn.approved && currentIncludesAddedAccountIn.approved) {
						// Sending a response
						return res.json({ message: "Friends", code: "friends".toUpperCase() });
					}
					// If the other account has requested to be friends with current account
					else if (addedIncludesCurrentAccountIn.requested) {
						// The approval of the current account
						const approvalOfCurrentAccount = currentAccount.friends.approved.create({
							accountId: addedAccount._id
						});
						// The approval of the added account
						const approvalOfAddedAccount = addedAccount.friends.approved.create({
							accountId: currentAccount._id
						});

						// The request object that was in the added account that must be pulled
						const requestObject = _.each(addedAccount.friends.requested, (account) => {
							if (account.accountId === currentAccount._id) return account;
						});
						// The pending object that was in current account that must be pulled
						const pendingObject = _.each(currentAccount.friends.pending, (account) => {
							if (account.accountId === addedAccount._id) return account;
						});
						// The notification that the added user will receive
						const notification = addedAccount.notifications.create({
							type: "accepted_friend_request".toUpperCase(),
							message: `${currentAccount.fullName} accepted your friend request`
						});

						// Pushing the friend to current account
						currentAccount.friends.approved.push(approvalOfCurrentAccount);
						// Removing the pending request from the current account
						currentAccount.friends.pending.pull(pendingObject);

						// Pusing current account to approved array
						addedAccount.friends.approved.push(approvalOfAddedAccount);
						// Sending a notification to the other account
						addedAccount.notifications.push(notification);
						// Removing the request object from the other account
						addedAccount.friends.requested.pull(requestObject);

						// Saving both accounts
						await currentAccount.save();
						await addedAccount.save();

						// Sending a response
						return res.json({ message: "Accepted", code: "accepted".toUpperCase() });
					}
					// If the friend request is pending from the current account
					else if (currentIncludesAddedAccountIn.pending) {
						// Sending a response
						return res.json({ message: "Pending", code: "PENDING" });
					}
					// If the friend request is pending from the added account
					else if (addedIncludesCurrentAccountIn.pending) {
						// The approval of the current account
						const approvalOfAddedAccount = addedAccount.friends.approved.create({
							accountId: currentAccount._id
						});
						// The approval of the added account
						const approvalOfCurrentAccount = currentAccount.friends.approved.create({
							accountId: addedAccount._id
						});

						// The request object that was in the current account that must be pulled
						const requestObject = _.each(currentAccount.friends.requested, (account) => {
							if (account.accountId === addedAccount.id) return account;
						});
						// The pending object that was in current account that must be pulled
						const pendingObject = _.each(addedAccount.friends.pending, (account) => {
							if (account.accountId === addedAccount._id) return account;
						});
						const notification = currentAccount.notifications.create({
							type: "accepted_friend_request".toUpperCase(),
							message: `${addedAccount.fullName} accepted your friend request`
						});

						currentAccount.notifications.push(notification);
						currentAccount.friends.requested.pull(requestObject);
						currentAccount.friends.approved.push(approvalOfCurrentAccount);

						addedAccount.frineds.pending.pull(pendingObject);
						addedAccount.friends.approved.push(approvalOfAddedAccount);

						return res.json({ message: "Pending", code: "PENDING" });
					}
				}
			}
		}
	});
};

exports.checkFriendship = async (req, res) => {
	// TODO:
};
