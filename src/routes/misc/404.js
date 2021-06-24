const Express = require("express");

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
module.exports = (req, res) => {
  res.status(404).json({
    error: "Something's not right",
    path: req.originalUrl,
  });
};
