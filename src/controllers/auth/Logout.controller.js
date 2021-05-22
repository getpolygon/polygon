export const logout = (_, res) => {
  res.clearCookie("jwt", {}).json();
};
