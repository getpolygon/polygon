import { postDao } from "@container";
import type { Handler } from "express";
import { Post } from "@dao/entities/Post";
import { APIResponse } from "@app/api/common/APIResponse";

// For creating a post
const create: Handler = async (req, res) => {
  const userId = req.user?.id;
  const { title, content } = req.body;
  const { id } = await postDao.createPost(new Post(title, userId!, content));
  const post = await postDao.getPostById(id!, userId!);
  return new APIResponse(res, { data: post, status: 201 });
};

export default create;
