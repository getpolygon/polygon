const _ = require("lodash");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const errors = require("../../errors/errors");
const AccountSchema = require("../../models/account");

exports.addFriend = (req, res) => {
	const { accountId } = req.query;
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) return res.json({ error: err, code: "jwt_error".toUpperCase() });
		else {
			if (!accountId) {
				return res.json(errors.friend.no_fr_account_id_spec);
			} else {
				const currentAccount = await AccountSchema.findById(data.id);
				const addedAccount = await AccountSchema.findById(accountId);

				// If current account does not exist
				if (!currentAccount) {
					return res.json(errors.account.does_not_exist);
				}
				// If other account does not exist
				else if (!addedAccount) {
					return res.json(errors.friend.outgoing_account_does_not_exist);
				}
				// If both accounts don't exist
				else if (!currentAccount && !addedAccount) {
					return res.json(errors.friend.both_accounts_do_not_exist);
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
					if (addedIncludesCurrentAccountIn.approved || currentIncludesAddedAccountIn.approved) {
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
							type: "accepted_friend_request".toUpperCase()
							// TODO: Add request parameter
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
							type: "accepted_friend_request".toUpperCase()
							// ! TODO add the request property
						});

						currentAccount.notifications.push(notification);
						currentAccount.friends.requested.pull(requestObject);
						currentAccount.friends.approved.push(approvalOfCurrentAccount);

						addedAccount.friends.pending.pull(pendingObject);
						addedAccount.friends.approved.push(approvalOfAddedAccount);

						return res.json({ message: "Pending", code: "PENDING" });
					} else {
						const requestObject = currentAccount.friends.requested.create({
							accountId: addedAccount._id
						});
						const pendingObject = addedAccount.friends.pending.create({
							accountId: currentAccount._id
						});
						const notification = addedAccount.notifications.create({
							type: "incoming_friend_request".toUpperCase(),
							request: {
								from: currentAccount._id
							}
						});

						addedAccount.notifications.push(notification);
						addedAccount.friends.pending.push(pendingObject);

						currentAccount.friends.requested.push(requestObject);

						await addedAccount.save();
						await currentAccount.save();

						return res.json({ message: "Sent", code: "friend_request_sent".toUpperCase() });
					}
				}
			}
		}
	});
};

exports.checkFriendship = (req, res) => {
	const { accountId } = req.query;
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) return res.json({ error: err, code: "error".toUpperCase() });
		else {
			if (accountId) {
				const currentAccount = await AccountSchema.findById(data.id);

				if (accountId === currentAccount._id) {
					return res.json({
						pending: false,
						approved: false,
						requested: false
					});
				} else {
					if (mongoose.Types.ObjectId.isValid(accountId)) {
						const otherAccount = await AccountSchema.findById(accountId);

						if (!currentAccount) {
							return res.json(errors.account.does_not_exist);
						} else if (!otherAccount) {
							return res.json(errors.friend.outgoing_account_does_not_exist);
						} else if (!currentAccount && !otherAccount) {
							return res.json(errors.friend.both_accounts_do_not_exist);
						} else {
							const pending = !_.isUndefined(_.find(currentAccount.friends.pending, { accountId }));
							const approved = !_.isUndefined(
								_.find(currentAccount.friends.approved, { accountId })
							);
							const requested = !_.isUndefined(
								_.find(currentAccount.friends.requested, { accountId })
							);

							return res.json({
								pending,
								approved,
								requested
							});
						}
					} else {
						return res.json(errors.account.invalid_id);
					}
				}
			} else {
				return res.json(errors.friend.no_fr_account_id_spec);
			}
		}
	});
};
