// import * as express from "express";

/**
 * Custom declarations
 */

export type User = {
  id: string;
  bio: string;
  cover: string;
  email: string;
  avatar: string;
  password: string;
  username: string;
  last_name: string;
  first_name: string;

  posts: Post[];
  comments: Comment[];
};

export type Relation = {
  id: string;
  to_user: string;
  from_user: string;
  created_at: string;
  status: RelationStatus;
};

export type RelationStatus = "BLOCKED" | "REQUESTED" | "FOLLOWING";

export type Post = {
  id: string;
  user: User;
  body: string;
  user_id: string;
  created_at: string;
  comments: Comment[];
  privacy: PostPrivacy;
};

export enum PostPrivacy {
  "PRIVATE",
  "PUBLIC",
}

export type Comment = {
  id: string;
  user: User;
  post: Post;
  body: string;
  user_id: string;
  post_id: string;
  created_at: string;
};

export type Token = {
  id: string;
};

/**
 * Global declarations
 */
declare global {
  namespace Express {
    interface Request {
      user?: Partial<User>;
      // file?: Multer.File;
      // files?: Multer.File[];
      signedCookies?: {
        jwt?: string;
      };
    }

    interface Response {
      user?: Partial<User>;
    }
  }
}
