import Express from "express";
import { Post } from "../../types";
import slonik from "../../db/slonik";
import {
  sql,
  InvalidInputError,
  UniqueIntegrityConstraintViolationError,
} from "slonik";
import { checkStatus } from "../../helpers/helpers";

// For fetching one post
export const fetchOne = async (req: Express.Request, res: Express.Response) => {
  // The id of the post
  const { id } = req.params;

  // Getting the post
  const post = await slonik.maybeOne(sql`
      SELECT
        Post.id,
        Post.body,
        Post.privacy,
        Post.created_at,
        row_to_json(Author) AS user,

      FROM posts Post

      INNER JOIN (
        SELECT 
            id, 
            avatar,
            username
            last_name, 
            first_name

        FROM users
      ) Author ON Post.user_id = Author.id

      WHERE Post.id = ${id!!} 
      GROUP BY Post.id, Author.* 
      ORDER BY Post.created_at DESC;
  `);

  // If post exists
  if (post) return res.json(post);
  else return res.status(403).json();
};

// For fetching one user's post
// TODO: Implement
export const fetch = async (req: Express.Request, res: Express.Response) => {
  // Cursor for next page
  const { cursor } = req.query;
  // Account's username to fetch posts
  const { username } = req.params;

  // Getting the user
  const user = await slonik.maybeOne(sql`
    SELECT * FROM users WHERE username = ${username!!};
  `);

  // Checking the relation between this and other account
  const status = await checkStatus({
    current: req?.user?.id!!,
    other: user?.id!! as string,
  });

  // If other account has blocked this one
  if (status === "BLOCKED") return res.status(403).json();
  else {
    if (!cursor) {
      const { rows: posts } = await slonik.query(sql`
        SELECT 
          Post.id,
          Post.body,
          Post.created_at,
          TO_JSON(Author) as user

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

        WHERE username = ${username}
        LIMIT 2;
      `);

      const next = "";

      return res.json({
        next,
        data: posts,
      });
    } else {
    }
  }
};

// For creating a post
export const create = async (req: Express.Request, res: Express.Response) => {
  // Post body
  const { body } = req.body;

  try {
    // Create new post
    const created = await slonik.maybeOne(sql`
        INSERT INTO posts (body, user_id) 
        VALUES (${body}, ${req.user?.id!!}) 
        RETURNING id;
    `);

    // Getting the post
    const post = await slonik.maybeOne(sql`
      SELECT Post.id, Post.body, Post.created_at, to_json(Author) AS user

      FROM posts Post

      INNER JOIN (
        SELECT 
          id,
          avatar,
          private,
          username,
          last_name,
          first_name

        FROM users
      ) Author ON Author.id = Post.user_id

      WHERE Post.id = ${created?.id!!} 
      GROUP BY Post.id, Author.* 
      ORDER BY Post.created_at DESC;
    `);

    // Sending the response
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }
};

// For removing a post
export const remove = async (req: Express.Request, res: Express.Response) => {
  try {
    // Getting post id from the query
    const { id } = req.params;

    // Deleting from the database
    const post = await slonik.maybeOne(sql`
      SELECT * FROM posts WHERE id = ${id!!};
    `);

    // Checking if the post exists
    if (post) {
      // If the author of the post is the same as current user
      if (post?.user_id === req.user?.id) {
        // Deleting the post
        await slonik.query(sql`
          DELETE FROM posts WHERE id = ${id.toString()};
        `);

        // Returing the response
        return res.status(204).json();
      } else return res.status(403).json();
    } else return res.status(404).json();
  } catch (error) {
    // If the ID of the post is invalid
    if (error instanceof InvalidInputError) return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

// For hearting a post
export const heart = async (req: Express.Request, res: Express.Response) => {
  // Getting post id from params
  const { id } = req.params;

  try {
    // TODO
  } catch (error) {
    if (error instanceof InvalidInputError) return res.status(400).json();
    else if (error instanceof UniqueIntegrityConstraintViolationError) {
    } else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

// For unhearting a post
export const unheart = async (req: Express.Request, res: Express.Response) => {
  const { id } = req.params;

  try {
    // TODO
  } catch (error) {
    if (error instanceof InvalidInputError) return res.status(400).json();
    else if (error instanceof UniqueIntegrityConstraintViolationError) {
    } else {
      console.error(error);
      return res.status(500).json();
    }
  }
};
