exports.logout = (_req, res) => {
	return res.clearCookie("jwt").json({
		message: "Logged out",
		code: "logged_out".toUpperCase()
	});
};
