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
    } = await slonik.query(sql`
      SELECT 
        Account.*, 
        to_json(
          array_remove(
            array_agg(Posts), NULL
          )
        ) AS posts,
        to_json(
          array_remove(
            array_agg(Comments), NULL
          )
        ) AS comments
      FROM users Account

      LEFT OUTER JOIN (SELECT * FROM posts) Posts ON Posts.user_id = Account.id
      LEFT OUTER JOIN (
        SELECT 
          Comment.*, 
          to_json(Post) as post
          
        FROM comments Comment

        LEFT OUTER JOIN posts Post ON Comment.post_id = Post.id
      ) Comments ON Comments.user_id = Account.id

      WHERE Account.username = ${req.user?.username!!}
      GROUP BY Account.id, Posts.*, Comments.*;
    `);

    return res.json(user);
  } else {
    // Find the user
    const {
      rows: { 0: user },
    } = await slonik.query(sql`
      SELECT 
        Account.*, 
        to_json(
          array_remove(
            array_agg(Posts), NULL
          )
        ) AS posts,
        to_json(
          array_remove(
            array_agg(Comments), NULL
          )
        ) AS comments
      FROM users Account

      LEFT OUTER JOIN (SELECT * FROM posts) Posts ON Posts.user_id = Account.id
      LEFT OUTER JOIN (
        SELECT 
          Comment.*, 
          to_json(Post) as post
          
        FROM comments Comment

        LEFT OUTER JOIN posts Post ON Comment.post_id = Post.id
      ) Comments ON Comments.user_id = Account.id

      WHERE Account.username = ${req.user?.username!!}
      GROUP BY Account.id, Posts.*, Comments.*;
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
