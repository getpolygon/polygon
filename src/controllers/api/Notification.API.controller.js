const NotificationAPIController = {
  fetch: (req, res) => res.json(req.user.notifications),
};

module.exports = NotificationAPIController;
