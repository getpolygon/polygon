const _ = require("lodash");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { JWT_PRIVATE_KEY } = process.env;
const AccountSchema = require("../../models/all/account");

// TODO
exports.addFriend = async (req, res) => {
  const { accountId } = req.query;

  if (!accountId) return res.status(400).send("Bad Request");
  else {
    const currentAccount = req.user;
    const addedAccount = await AccountSchema.findById(accountId);

    if (!addedAccount) return res.status(410).send("Account Not Found");
    else {
      const currentAccountInFriendList = addedAccount.friends.filter(
        (account) => {
          account._id === currentAccount._id;
        }
      )[0];

      if (!currentAccountInFriendList) {
      } else {
      }
    }
  }
};

exports.checkFriendship = (req, res) => {
  const { accountId } = req.query;
  const { jwt: token } = req.cookies;

  jwt.verify(token, JWT_PRIVATE_KEY, async (error, data) => {
    if (error) {
      return res.status(498).json({
        // TODO
      });
    } else {
      if (accountId) {
        const currentAccount = await AccountSchema.findById(data.id);

        if (currentAccount) {
          if (accountId === currentAccount._id) {
            return res.json({
              pending: false,
              approved: false,
              requested: false,
            });
          } else {
            if (mongoose.Types.ObjectId.isValid(accountId)) {
              const otherAccount = await AccountSchema.findById(accountId);

              if (!otherAccount) {
                return res.status(404).json({
                  // TODO
                });
              } else {
                const pending = !_.isUndefined(
                  _.find(currentAccount.friends.pending, { accountId })
                );
                const approved = !_.isUndefined(
                  _.find(currentAccount.friends.approved, { accountId })
                );
                const requested = !_.isUndefined(
                  _.find(currentAccount.friends.requested, { accountId })
                );

                return res.json({
                  pending,
                  approved,
                  requested,
                });
              }
            } else {
              // TODO
              return res.status().json();
            }
          }
        } else {
          // TODO
        }
      } else {
        // TODO
      }
    }
  });
};
