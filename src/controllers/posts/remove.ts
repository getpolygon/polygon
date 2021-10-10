import pg from "../../db/pg";
import express from "express";
import getFirst from "../../utils/getFirst";
import type { Post } from "../../types/post";

// For removing a post
const remove = async (req: express.Request, res: express.Response) => {
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
  } catch (error: any) {
    // Invalid cursor ID
    if (error?.code === "22P02") return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

export default remove;
