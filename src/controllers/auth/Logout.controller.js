exports.logout = (req, res) => {
  const { jwt: token } = req.signedCookies;

  if (token) res.status(200).clearCookie("jwt").send("Logged Out");
  else res.status(403).send("Please Login");
};
