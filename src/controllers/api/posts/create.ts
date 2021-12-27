import { postDao } from "container";
import { Post } from "dao/entities/Post";
import type { Request, Response } from "express";

// For creating a post
const create = async (req: Request, res: Response) => {
  // Get the post title, content, and user id from the request
  const userId = req.user?.id;
  const { title, content } = req.body;

  // Create a new post using the post DAO.
  const post = postDao.createPost(new Post(title, userId!, content));
  // Send the post back to the client
  return res.status(201).json(post);
};

export default create;
