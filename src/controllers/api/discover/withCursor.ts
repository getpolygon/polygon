import type { Request, Response } from "express";

const withCursor = (_: Request, res: Response) => {
  return res.sendStatus(501);
};

export default withCursor;
