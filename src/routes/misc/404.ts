import express from "express";

export default (req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: "Something's not right",
    path: req.originalUrl,
  });
};
