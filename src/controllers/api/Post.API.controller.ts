import pg from "../../db/pg";
import express from "express";
import type { Post, User } from "../../@types";
import getFirst from "../../utils/db/getFirst";
import { checkStatus } from "../../helpers/helpers";

// For fetching one post
export const fetchOne = async (req: express.Request, res: express.Response) => {
  // The id of the post
  const { id } = req.params;

  try {
    // Getting the post
    const post = await getFirst<Partial<Post>>(
      `
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

      WHERE Post.id = $1
      GROUP BY Post.id, Author.*
      ORDER BY Post.created_at DESC;
      `,
      [id]
    );

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
    // TODO: Handle invalid post UUID errors
    // if (error instanceof InvalidInputError) return res.status(400).json();
    // else {
    //   console.error(error);
    //   return res.status(500).json();
    // }
  }
};

// For fetching one user's post
export const fetch = async (req: express.Request, res: express.Response) => {
  // Optional cursor for next page
  const { cursor } = req.query;
  // The username of the user to fetch posts from
  const { username } = req.params;

  // Getting post author
  const user = await getFirst<User>("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

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
        [user?.id]
      );

      return res.json({
        data: posts,
        next: posts[posts.length - 1]?.id || null,
      });
    }
    // If cursor was given
    else {
      try {
        // Fetching the post with the supplied cursor
        const cursorPost = await getFirst<Post>(
          "SELECT * FROM posts WHERE id = $1 AND user_id = $2",
          [cursor, user?.id]
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

          WHERE Post.created_at < $1 OR 
          (Post.created_at = $1 AND Post.id < $2) AND 
          Post.user_id = $3 ORDER BY Post.created_at DESC, Post.id DESC 
          LIMIT 2;
          `,
          [cursorPost?.created_at!!, cursor, user?.id!!]
        );

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
  const { body } = req.body;

  try {
    const created = await getFirst<Partial<Post>>(
      "INSERT INTO posts (body, user_id) VALUES ($1, $2) RETURNING id",
      [body, req.user?.id]
    );

    // Getting newly created post with the auther
    const post = await getFirst(
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
      [created?.id]
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
  const { id } = req.params;

  try {
    const post = await getFirst<Post>("SELECT * FROM posts WHERE id = $1", [
      id,
    ]);

    if (post) {
      // If the author of the post is the same as current user
      if (post?.user_id === req.user?.id) {
        // Deleting the post
        await pg.query("DELETE FROM posts WHERE id = $1", [id]);
        return res.status(204).json();
      } else return res.status(403).json();
    } else return res.status(404).json();
  } catch (error) {
    // TODO: Handle invalid post UUID errors
    // If the ID of the post is invalid
    // if (error instanceof InvalidInputError) return res.status(400).json();
    // else {
    //   console.error(error);
    //   return res.status(500).json();
    // }
  }
};

// For hearting a post
export const heart = async (req: express.Request, res: express.Response) => {
  // Getting post id from params
  const { id } = req.params;

  try {
    // TODO
  } catch (error) {
    // TODO: Handle invalid post UUID errors
    // if (error instanceof InvalidInputError) return res.status(400).json();
    // else if (error instanceof UniqueIntegrityConstraintViolationError) {
    // } else {
    //   console.error(error);
    //   return res.status(500).json();
    // }
  }
};

// For unhearting a post
export const unheart = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  try {
    // TODO
  } catch (error) {
    // TODO: Handle invalid post UUID errors
    // if (error instanceof InvalidInputError) return res.status(400).json();
    // else if (error instanceof UniqueIntegrityConstraintViolationError) {
    // } else {
    //   console.error(error);
    //   return res.status(500).json();
    // }
  }
};
