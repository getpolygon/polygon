const NotificationAPIController = {
  getAll: (req, res) => res.json(req.user.notifications),
};

module.exports = NotificationAPIController;
