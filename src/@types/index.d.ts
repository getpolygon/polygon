import * as express from "express";

export type User = {
  id: string;
  bio: string;
  email: string;
  avatar: string;
  password: string;
  username: string;
  last_name: string;
  first_name: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: User;
      file?: Multer.File;
      files?: Multer.File[];
      signedCookies?: {
        jwt?: string;
      };
    }

    interface Response {
      user?: User;
    }
  }
}

export type Token = {
  id: string;
};
