import pg from "../../../db/pg";
import getFirst from "../../../util/getFirst";
import type { Request, Response } from "express";

// For removing a post
const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await getFirst<{ user_id: string }>(
      "SELECT user_id FROM posts WHERE id = $1",
      [id]
    );

    if (post) {
      // If the author of the post is the same as current user
      if (post?.user_id === req.user?.id) {
        // Deleting the post
        await pg.query("DELETE FROM posts WHERE id = $1", [id]);
        return res.sendStatus(204);
      }

      return res.sendStatus(403);
    }

    return res.sendStatus(404);
  } catch (error: any) {
    // Invalid cursor ID
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};

export default remove;
