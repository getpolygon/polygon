exports.getAllNotifications = (req, res) => {
  res.json(req.user.notifications);
};
