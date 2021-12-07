import { isEqual, isNil } from "lodash";
import { postRepository } from "db/dao";
import type { Request, Response } from "express";

// For removing a post
const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // prettier-ignore
    const post = await postRepository.findOne({ key: "id", value: id }, ["user_id"]);

    if (!isNil(post)) {
      // Checking whether the author is the same as the current user
      if (isEqual(post.user_id, req.user?.id)) {
        await postRepository.remove({ key: "id", value: id });
        return res.sendStatus(204);
      }

      return res.sendStatus(403);
    }

    return res.sendStatus(404);
  } catch (error: any) {
    // Invalid cursor ID
    if (isEqual(error?.code, "22P02")) return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};

export default remove;
