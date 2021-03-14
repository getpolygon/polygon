const jwt = require("jsonwebtoken");
const errors = require("../../errors/errors");
const AccountSchema = require("../../models/account");

exports.query = (req, res) => {
	const { query } = req.query;
	const token = req.cookies.jwt;

	jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
		if (err) {
			return res.json(errors.jwt.invalid_token_or_does_not_exist);
		} else {
			if (!query) return res.json(errors.search.no_query);
			else {
				const regex = new RegExp(query, "gu");
				const results = await AccountSchema.find({ firstName: regex }).where("_id").ne(data.id);

				return res.json(results);
			}
		}
	});
};
