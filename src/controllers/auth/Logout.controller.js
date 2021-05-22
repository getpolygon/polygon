exports.logout = (_, res) => {
  res.clearCookie("jwt", {}).json();
};
