import type { Handler } from "express";
import { trim, escape, toLower } from "lodash";

const normalize = (email: string) => trim(escape(toLower(email)));

export const normalizeEmail = (paths: string[]): Handler => {
  return async (req, _, next) => {
    paths.map((p) => (req.body[p] = normalize(req.body[p])));
    return next(null);
  };
};
