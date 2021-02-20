const jwt = require("jsonwebtoken");
const AccountSchema = require("../../models/account");

exports.query = async (req, res) => {
  const { query } = req.query;
  const token = req.cookies.jwt;

  jwt.verify(token, process.env.JWT_TOKEN, async (err, data) => {
    if (err) {
      return res.status(403).json({
        error: "Forbidden"
      });
    } else if (data) {
      if (!query) {
        return res.json({
          error: "No query provided"
        });
      } else {
        const currentAccount = await AccountSchema.findById(data.id);
        const regex = new RegExp(query, "gu");
        const results = await AccountSchema.find({ fullName: regex })
          .where("_id")
          .ne(currentAccount._id);

        return res.status(200).json(results);
      }
    }
  });
};
