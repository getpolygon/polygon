import slonik from "../../db/slonik";
import { Request, Response } from "express";
import { InvalidInputError, sql } from "slonik";
import { checkStatus } from "../../helpers/helpers";

// For post discovery
// TODO: Implement cursor based pagination
export const posts = async (req: Request, res: Response) => {
  // Getting next page cursor and post limit per page
  let { cursor: _, limit = 2 } = req.query;

  // Not letting more than 10 posts per page
  if (limit > 10) limit = 2;

  try {
    const { rows: posts } = await slonik.query(sql`
      SELECT Post.*, TO_JSON(Author) AS user 
      FROM posts Post
      INNER JOIN (
        SELECT
          id,
          avatar,
          username,
          last_name,
          first_name,
          created_at

        FROM users
      ) Author ON Post.user_id = Author.id
      ORDER BY Post.created_at DESC
      LIMIT ${Number(limit) || 2};
    `);

    // Filtering out posts from blocked users
    for await (const post of posts) {
      // Checking relationship status
      const status = await checkStatus({
        current: req.user?.id!!,
        other: post.user_id as string,
      });

      // If either of the sides has blocked one or another, remove the post from the array
      if (status === "BLOCKED") posts.filter((p) => p.id !== post.id);
    }

    // TODO
    const next = "";

    return res.json({
      next,
      data: posts,
    });
  } catch (error) {
    if (error instanceof InvalidInputError) return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

// For discovering popular accounts
// TODO: Implement
export const accounts = async (req: Request, res: Response) => {};
