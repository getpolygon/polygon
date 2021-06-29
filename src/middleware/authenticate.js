// Will be used for adding types
const Express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma");
const { JWT_PRIVATE_KEY } = process.env;

/**
 * Middleware for authenticating users
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 * @returns {Express.NextFunction | Express.Response}
 */
module.exports = async (req, res, next) => {
  // Getting the `jwt` cookie
  const { jwt: token } = req.signedCookies;

  // Checking if it exists
  if (!token) return res.status(403).send();
  else {
    // Getting the ID from the token
    const data = jwt.verify(token, JWT_PRIVATE_KEY);
    // Finding the user with the ID
    const user = await prisma.user.findFirst({
      where: {
        id: data.id,
      },
      include: {
        posts: true,
        comments: true,
      },
    });
    // If there's no such account, forbid the request
    if (!user) return res.status(403).send();
    // Move on to the next handler
    else {
      req.user = user;
      return next();
    }
  }
};
