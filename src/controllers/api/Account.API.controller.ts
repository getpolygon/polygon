import { sql } from "slonik";
import Express from "express";
import slonik from "../../db/slonik";
import { User } from "../../@types";

// For fetching account details
export const fetchAccount = async (
  req: Express.Request,
  res: Express.Response
) => {
  // Get the username from the query
  const { username } = req.query;

  // If no account ID was provided
  if (!username) {
    // Get current user
    const {
      rows: { 0: user },
    } = await slonik.query<User>(sql`
      SELECT * FROM users WHERE id = ${req.user?.id!!}
    `);

    // Get all posts
    const { rows: posts } = await slonik.query(sql`
      SELECT * FROM posts WHERE user_id = ${req.user?.id!!}
    `);

    // Get all comments
    const { rows: comments } = await slonik.query(sql`
      SELECT * FROM comments WHERE user_id = ${req.user?.id!!}
    `);

    user.posts = posts as [];
    user.comments = comments as [];

    return res.json(user);
  } else {
    // Find the user
    const {
      rows: { 0: user },
    } = await slonik.query<User>(sql`
      SELECT * FROM users WHERE username = ${username.toString()} LIMIT 1
    `);
    // If user does not exist
    if (!user) return res.status(404).send();
    else return res.json(user);
  }
};

// For deleting account
export const deleteAccount = async (
  req: Express.Request,
  res: Express.Response
) => {};

// For updating account
export const updateAccount = async (
  req: Express.Request,
  res: Express.Response
) => {};
