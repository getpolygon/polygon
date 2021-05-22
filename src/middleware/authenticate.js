const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = process.env;
const AccountSchema = require("../models/all/account");

// Middleware for authenticating users
module.exports = async (req, res, next) => {
  // Getting the `jwt` cookie
  const { jwt: token } = req.signedCookies;

  // Checking if it exists
  if (!token) {
    // Forbidden
    return res.status(403).send("Unauthorized");
  } else {
    // Getting the ID from the token
    const data = jwt.verify(token, JWT_PRIVATE_KEY);
    // Finding the user with the ID
    const account = await AccountSchema.findById(data.id);

    // If there's no such account, forbid the request
    if (!account) return res.status(403).send("Unauthorized");
    // Move on to the next handler
    else {
      req.user = account;
      return next();
    }
  }
};
