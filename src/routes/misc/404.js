module.exports = (req, res) => {
  res.status(404).json({
    error: "Something's not right",
    path: req.originalUrl,
  });
};
