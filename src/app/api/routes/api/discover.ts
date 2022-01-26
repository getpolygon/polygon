import { z } from "zod";
import express from "express";
import { zodiac } from "@middleware/zodiac";
import { uuidValidator } from "@middleware/uuidValidator";
import { posts, withCursor } from "@api/controllers/discover";

const router = express.Router();

const applyLocalValidators = () => {
  return zodiac({
    query: z.object({
      limit: z.number().min(2).max(10).default(2),
    }),
  });
};

// For getting the first paginated set of posts without allowing cursors
router.get("/posts", applyLocalValidators(), posts);

// For getting paginated set of posts with cursors
router.get(
  "/posts/:cursor",
  uuidValidator(["cursor"]),
  applyLocalValidators(),
  withCursor
);

export default router;
