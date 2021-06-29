import * as express from "express";
import { User } from "@prisma/client";

declare module "express" {
  interface Request {
    user?: User;
  }
  interface Response {
    user?: User;
  }
}

export type Token = {
  id: string;
};
