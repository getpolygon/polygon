import type { Request, Response } from "express";

// For fetching one user's post
const ofUser = async (_req: Request, _res: Response) => {
  throw new Error("Method not implemented.");
  // // Previous post cursor
  // const { cursor } = req.query;
  // const { username } = req.params;

  // // Getting post author

  // // Checking the relation between this and author account
  // const status = await checkStatus({
  //   other: user?.id!!,
  //   current: req?.user?.id!!,
  // });

  // // If other account has blocked this one
  // if (isEqual(status, "BLOCKED")) return res.sendStatus(403);
  // else {
  //   if (isNil(cursor)) {
  //     const { rows: posts } = await pg.query(
  //       `
  //         SELECT
  //           post.id,
  //           post.title,
  //           post.content,
  //           post.created_at,
  //           TO_JSON(author) as user,
  //           (
  //             SELECT COUNT(*) FROM upvotes
  //             WHERE upvotes.post_id = post.id
  //           )::INT AS upvote_count,
  //           (
  //             SELECT COUNT(*) FROM comments
  //             WHERE comments.post_id = post.id
  //           ):: INT AS comment_count

  //         FROM posts post

  //         INNER JOIN (
  //           SELECT
  //             id,
  //             avatar,
  //             username,
  //             last_name,
  //             first_name,
  //             created_at

  //           FROM users
  //         ) author ON post.user_id = author.id

  //         WHERE post.user_id = $1
  //         ORDER BY post.created_at DESC LIMIT 2;
  //         `,
  //       [user?.id]
  //     );

  //     return res.json({
  //       data: posts,
  //       next: nth(posts, -1)?.id || null,
  //     });
  //   }
  //   // If cursor was given
  //   else {
  //     try {
  //       // Fetching the post with the supplied cursor
  //       const cursorPost = await getFirst<{ created_at: Date }>(
  //         "SELECT created_at FROM posts WHERE id = $1 AND user_id = $2",
  //         [cursor, user?.id]
  //       );

  //       // Fetching the posts on current page
  //       const { rows: posts } = await pg.query(
  //         `
  //           SELECT
  //             post.id,
  //             post.content,
  //             post.created_at,
  //             TO_JSON(Author) as user,
  //             (
  //               SELECT COUNT(*) FROM upvotes
  //               WHERE upvotes.post_id = post.id
  //             )::INT AS upvotes

  //           FROM posts post

  //           INNER JOIN (
  //             SELECT
  //               id,
  //               avatar,
  //               username,
  //               last_name,
  //               first_name,
  //               created_at
  //             FROM users
  //           ) author ON post.user_id = author.id

  //           WHERE post.created_at < $1 OR
  //           (post.created_at = $1 AND post.id < $2) AND post.user_id = $3
  //           ORDER BY post.created_at DESC, post.id DESC LIMIT 2;
  //           `,
  //         [cursorPost?.created_at!!, cursor, user?.id!!]
  //       );

  //       return res.json({
  //         data: posts,
  //         next: nth(posts, -1)?.id || null,
  //       });
  //     } catch (error: any) {
  //       console.error(error);
  //       return res.sendStatus(500);
  //     }
  //   }
  // }
};

export default ofUser;
