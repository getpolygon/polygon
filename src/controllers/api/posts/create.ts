import express from "express";
import getFirst from "../../../util/getFirst";
import type { Post } from "../../../types/post";

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
        SELECT 
          post.id, 
          post.body, 
          post.created_at, 
          TO_JSON(author) AS user
  
        FROM posts post
  
        INNER JOIN (
          SELECT 
            id,
            avatar,
            username,
            last_name,
            first_name
  
          FROM users
        ) author ON author.id = post.user_id
  
        WHERE post.id = $1
        GROUP BY post.id, author.* 
        ORDER BY post.created_at DESC;
      `,
      [created?.id]
    );

    // Sending the response
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default create;
