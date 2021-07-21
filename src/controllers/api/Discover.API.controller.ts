import { sql } from "slonik";
import { Post, User } from "../../types";
import slonik from "../../db/slonik";
import { Request, Response } from "express";

export const posts = async (req: Request, res: Response) => {
  const { cursor } = req.query;

  const offset = Number(cursor) || 0;
  const next = offset + 2;
  const prev = offset - 2;

  const { rows: nextPosts } = await slonik.query(sql<Partial<Post>[]>`
    SELECT * FROM posts Post

    WHERE Post.privacy <> 'PRIVATE'
    ORDER BY Post.created_at
    LIMIT 2 OFFSET ${next};
  `);

  const { rows: posts } = await slonik.query(sql<Partial<Post>[]>`
    SELECT
      Post.id,
      Post.body,
      Post.privacy,
      Post.created_at,
      to_json(Author) AS user,
      to_json(array_remove(array_agg(Comments), NULL)) AS comments

    FROM posts Post

    LEFT OUTER JOIN (
      SELECT 
        id, 
        avatar, 
        private, 
        username, 
        last_name, 
        first_name 

      FROM users
    ) Author ON Author.id = Post.user_id
    
    LEFT OUTER JOIN (
      SELECT
        Comment.*,
        to_json(CommentAuthor) AS user

      FROM comments Comment

      LEFT OUTER JOIN (
        SELECT 
          id, 
          bio,
          avatar, 
          username, 
          first_name, 
          last_name
            
          FROM users
      ) CommentAuthor ON Comment.user_id = CommentAuthor.id
    ) Comments ON Post.id  = Comments.post_id

    WHERE Post.privacy <> 'PRIVATE'
    GROUP BY Post.id, Author.*, Comments.*
    ORDER BY Post.created_at
    LIMIT 2 OFFSET ${offset};
  `);

  return res.json({
    prev,
    data: posts,
    next: nextPosts.length === 0 ? null : next,
  });
};

// TODO: Implement
export const accounts = async (req: Request, res: Response) => {
  const { rows: accounts } = await slonik.query(sql<Partial<User>[]>`

  `);

  return res.json(accounts);
};
