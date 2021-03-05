exports.logout = (req, res) => {
	req.session.destroy();
	return res.status(200).clearCookie("jwt").json({
		message: "Logged out"
	});
};
