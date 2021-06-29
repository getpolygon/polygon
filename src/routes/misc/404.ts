import Express from "express";

export default (req: Express.Request, res: Express.Response) => {
  res.status(404).json({
    error: "Something's not right",
    path: req.originalUrl,
  });
};
