import Express from "express";

const NotificationAPIController = {
  fetch: (req: Express.Request, res: Express.Response) => {
    res.json(req.user.notifications);
  },
};

module.exports = NotificationAPIController;
