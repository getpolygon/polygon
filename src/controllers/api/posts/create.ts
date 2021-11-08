import express from "express";
import getFirst from "../../../util/getFirst";
import type { Post } from "../../../types/post";

// For creating a post
const create = async (req: express.Request, res: express.Response) => {
  // Getting the title of the post and optional body
  const { title, body } = req.body;

  try {
    const created = await getFirst<Partial<Post>>(
      `
      INSERT INTO posts (title, content, user_id)
      VALUES ($1, $2, $3) RETURNING id
      `,
      [title, body, req.user?.id]
    );

    // Getting newly created post with the auther
    const post = await getFirst(
      `
        SELECT 
          post.id, 
          post.title,
          post.content,
          post.created_at, 
          TO_JSON(author) AS user,
          (
            SELECT COUNT(*) FROM upvotes 
            WHERE upvotes.post_id = post.id
          )::INT as upvotes
  
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
    return res.status(201).json(post);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default create;
