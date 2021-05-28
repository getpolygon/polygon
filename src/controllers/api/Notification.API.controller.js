exports.getAll = (req, res) => res.json(req.user.notifications);
