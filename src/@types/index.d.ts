import * as express from "express";
import { User, Post, Comment, Notification } from "@prisma/client";

declare module "express-serve-static-core" {
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
