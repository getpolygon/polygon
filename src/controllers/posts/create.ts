import express from "express";
import getFirst from "../../utils/getFirst";
import type { Post } from "../../types/post";

// For creating a post
const create = async (req: express.Request, res: express.Response) => {
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
            username,
            last_name,
            first_name,
            is_private
  
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

export default create;
