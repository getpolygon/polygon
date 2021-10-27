import pg from "../../../db/pg";
import express from "express";
import getFirst from "../../../utils/getFirst";
import type { User } from "../../../types/user";
import type { Post } from "../../../types/post";
import checkStatus from "../../../utils/checkStatus";

// For fetching one user's post
const ofUser = async (req: express.Request, res: express.Response) => {
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

export default ofUser;
