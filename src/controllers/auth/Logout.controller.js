exports.logout = (req, res) => {
  const { jwt: token } = req.signedCookies;

  if (token) res.status(200).clearCookie("jwt").send();
  else res.status(403).send();
};
