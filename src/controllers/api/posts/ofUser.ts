import pg from "../../../db/pg";
import getFirst from "../../../util/getFirst";
import type { User } from "../../../types/user";
import type { Post } from "../../../types/post";
import type { Request, Response } from "express";
import checkStatus from "../../../util/checkStatus";

// For fetching one user's post
const ofUser = async (req: Request, res: Response) => {
  // Optional of last post
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
  if (status === "BLOCKED") return res.sendStatus(403);
  else {
    if (!cursor) {
      const { rows: posts } = await pg.query(
        `
          SELECT
            post.id,
            post.title,
            post.content,
            post.created_at,
            TO_JSON(author) as user,
            (
              SELECT COUNT(*) FROM upvotes
              WHERE upvotes.post_id = post.id
            )::INT AS upvotes

          FROM posts post

          INNER JOIN (
            SELECT
              id,
              avatar,
              username,
              last_name,
              first_name,
              created_at

            FROM users
          ) author ON post.user_id = author.id

          WHERE post.user_id = $1
          ORDER BY post.created_at DESC LIMIT 2;
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
              post.id,
              post.content,
              post.created_at,
              TO_JSON(Author) as user,
              (
                SELECT COUNT(*) FROM upvotes
                WHERE upvotes.post_id = post.id
              )::INT AS upvotes

            FROM posts post

            INNER JOIN (
              SELECT
                id,
                avatar,
                username,
                last_name,
                first_name,
                created_at
              FROM users
            ) author ON post.user_id = author.id

            WHERE post.created_at < $1 OR
            (post.created_at = $1 AND post.id < $2) AND post.user_id = $3
            ORDER BY post.created_at DESC, post.id DESC LIMIT 2;
            `,
          [cursorPost?.created_at!!, cursor, user?.id!!]
        );

        return res.json({
          data: posts,
          next: posts[posts.length - 1]?.id || null,
        });
      } catch (error: any) {
        // Invalid cursor ID
        if (error?.code === "22P02") return res.sendStatus(400);

        console.error(error);
        return res.sendStatus(500);
      }
    }
  }
};

export default ofUser;
