const jwt = require("jsonwebtoken");
const AccountSchema = require("../../models/all/account");

const { JWT_TOKEN } = process.env;

exports.query = (req, res) => {
  const { query } = req.query;
  const { jwt: token } = req.cookies;

  jwt.verify(token, JWT_TOKEN, async (error, data) => {
    if (error) {
      // TODO
    } else {
      if (!query) {
        // TODO
      } else {
        const regex = new RegExp(query, "gu");
        const results = await AccountSchema.find({
          firstName: regex,
          lastName: regex,
        })
          .where("_id")
          .ne(data.id);

        return res.json(results);
      }
    }
  });
};
