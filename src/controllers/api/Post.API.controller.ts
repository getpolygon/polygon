import pg from "../../db/pg";
import express from "express";
import slonik from "../../db/slonik";
import {
  sql,
  InvalidInputError,
  UniqueIntegrityConstraintViolationError,
} from "slonik";
import { checkStatus } from "../../helpers/helpers";

// For fetching one post
export const fetchOne = async (req: express.Request, res: express.Response) => {
  // The id of the post
  const { id } = req.params;

  try {
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

    // Fetching the relation status between users
    const status = await checkStatus({
      current: req.user?.id!!,
      other: post?.user_id!! as string,
    });

    // If post exists
    if (!post) return res.status(404).json();
    else {
      // If post author has blocked current user
      if (status === "BLOCKED") return res.status(403).json();
      else return res.json(post);
    }
  } catch (error) {
    if (error instanceof InvalidInputError) return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

// For fetching one user's post
export const fetch = async (req: express.Request, res: express.Response) => {
  // Cursor for next page
  const { cursor } = req.query;
  // Account's username to fetch posts
  const { username } = req.params;

  // Getting post author
  const user = await slonik.maybeOne(sql`
    SELECT * FROM users WHERE username = ${username!!};
  `);

  // Checking the relation between this and author account
  const status = await checkStatus({
    current: req?.user?.id!!,
    other: user?.id!! as string,
  });

  // If other account has blocked this one
  if (status === "BLOCKED") return res.status(403).json();
  else {
    if (!cursor) {
      const { rows: posts } = await pg.query(
        `
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

        WHERE Post.user_id = $1
        ORDER BY Post.created_at DESC LIMIT 2;
        `,
        [user?.id!!]
      );

      // Fetching next page
      // const next = await new Promise(async (resolve, _) => {
      //   if (posts.length === 0) return resolve(null);
      //   else {
      //     const lastPost = posts[posts.length - 1];
      //     const { rows } = await pg.query(
      //       `
      //       SELECT * FROM posts
      //       WHERE user_id = $1
      //       AND created_at <= $2
      //       AND (created_at < $2 OR id < $3)
      //       ORDER BY created_at DESC, id DESC LIMIT 1;
      //     `,
      //       [user?.id!!, lastPost?.created_at!!, lastPost?.id!!]
      //     );

      //     return resolve(rows[0]?.id!! || null);
      //   }
      // });

      return res.json({
        data: posts,
        next: posts[posts.length - 1]?.id || null,
      });
    }
    // If cursor was given
    else {
      try {
        // Fetching the post with the supplied cursor
        const {
          rows: { 0: cursorPost },
        } = await pg.query(
          `SELECT * FROM posts WHERE id = $1 AND user_id = $2`,
          [cursor, user?.id!!]
        );

        // Fetching the posts on current page
        const { rows: posts } = await pg.query(
          `
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

          WHERE Post.created_at < $1 OR (Post.created_at = $1 AND Post.id < $2) AND Post.user_id = $3
          ORDER BY Post.created_at DESC, Post.id DESC LIMIT 2;
        `,
          [cursorPost?.created_at!!, cursor, user?.id!!]
        );

        // Fetching next page
        // const next = await new Promise(async (resolve, _) => {
        //   if (posts.length === 0) return resolve(null);
        //   else {
        //     const lastPost = posts[posts.length - 1];
        //     const { rows } = await pg.query(
        //       `
        //       SELECT * FROM posts WHERE user_id = $1
        //       AND created_at <= $2 AND (created_at < $2 OR id < $3)
        //       ORDER BY created_at DESC, id DESC LIMIT 1;
        //     `,
        //       [user?.id!!, lastPost?.created_at!!, lastPost?.id!!]
        //     );

        //     return resolve(rows[0]?.id!! || null);
        //   }
        // });

        return res.json({
          data: posts,
          next: posts[posts.length - 1]?.id || null,
        });
      } catch (error: any) {
        // Invalid cursor ID
        if (error?.code === "22P02") return res.status(400).json();
        else {
          console.error(error);
          return res.status(500).json();
        }
      }
    }
  }
};

// For creating a post
export const create = async (req: express.Request, res: express.Response) => {
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
    const {
      rows: { 0: post },
    } = await pg.query(
      `
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

      WHERE Post.id = $1
      GROUP BY Post.id, Author.* 
      ORDER BY Post.created_at DESC;
    `,
      [created?.id!!]
    );

    // Sending the response
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }
};

// For removing a post
export const remove = async (req: express.Request, res: express.Response) => {
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
export const heart = async (req: express.Request, res: express.Response) => {
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
export const unheart = async (req: express.Request, res: express.Response) => {
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
