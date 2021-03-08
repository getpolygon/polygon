const jwt = require("jsonwebtoken");

const redis = require("../../db/redis");
const errors = require("../../errors/errors");

// Used for sending a simple get request to the server and setting the key in redis
exports.heartbeat = (req, res) => {
	const { jwt: token } = req.cookies;

	jwt.verify(token, process.env.JWT_TOKEN, (err, data) => {
		if (err) {
			return res.json(errors.jwt.invalid_token_or_does_not_exist);
		} else {
			// Setting connection status to true
			redis.set(data.id, JSON.stringify({ connected: true }));
			redis.get(data.id, (err, reply) => {
				if (err) return res.json(errors.unexpected.unexpected_error);
				else {
					setTimeout(() => {
						redis.del(data.id);
					}, 60 * 5 * 1000);
					return res.json(JSON.parse(reply));
				}
			});
		}
	});
};

exports.getStatus = (req, res) => {
	const { accountId } = req.query;
	const { jwt: token } = req.cookies;

	// Verifying that our user is valid
	jwt.verify(token, process.env.JWT_TOKEN, (err, _data) => {
		if (err) return res.json(errors.jwt.invalid_token_or_does_not_exist);
		else {
			// If account id was provided
			if (accountId) {
				redis.exists(accountId, (err, reply) => {
					if (err) return res.json(errors.unexpected.unexpected_error);
					else {
						if (reply) {
							return res.json({ connected: true });
						} else {
							return res.json({ connected: false });
						}
					}
				});
			} else {
				return res.json(errors.network.status_get_error_no_account_id_provided);
			}
		}
	});
};
