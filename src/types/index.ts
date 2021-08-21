/**
 * Custom declarations
 */
export type User = {
  id: string;
  bio: string;
  email: string;
  password: string;
  username: string;
  last_name: string;
  first_name: string;
  cover: string | null;
  avatar: string | null;
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
};

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
  namespace express {
    interface Request {
      user?: Partial<User>;
      signedCookies?: {
        jwt?: string;
      };
    }

    interface Response {
      user?: Partial<User>;
    }
  }
}
