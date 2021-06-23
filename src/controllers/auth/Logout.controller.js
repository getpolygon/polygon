const Express = require("express");

/**
 * Logout controller
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
module.exports = (req, res) => {
  const { jwt: token } = req.signedCookies;
  if (token) res.status(200).clearCookie("jwt").send();
  else res.status(403).send();
};
