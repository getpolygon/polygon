const { JWT_PRIVATE_KEY } = process.env;
const jwt = require("jsonwebtoken");
const AccountSchema = require("../../models/all/account");

exports.verify = (req, res) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    // TODO
    return res.status(403).json(token);
  } else {
    jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
      if (err) return res.status(403).json(err);
      else {
        const user = await AccountSchema.findById(data.id);

        if (user) return res.status(200).json(true);
        else return res.status(403).clearCookie("jwt").json(false);
      }
    });
  }
};
