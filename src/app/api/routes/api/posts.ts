import { z } from "zod";
import express from "express";
import { zodiac } from "@middleware/zodiac";
import { uuidValidator } from "@middleware/uuidValidator";
import { only, create, remove, ofUser } from "@api/controllers/posts";

const router = express.Router();

// For fetching only one post
router.get("/only/:id", uuidValidator(), only);

// For deleting a post
router.delete("/:id/delete", uuidValidator(), remove);

// For fetching the posts of a user
router.get(
  "/:username",
  zodiac({
    params: z.object({
      username: z.string(),
    }),

    query: z.object({
      cursor: z.string().uuid().optional(),
      limit: z.number().min(2).max(10).default(2),
    }),
  }),
  ofUser
);

// For creating a post
router.post(
  "/create",
  zodiac({
    body: z.object({
      title: z.string(),
      content: z.optional(z.string()).nullable().default(null),
    }),
  }),
  create
);

export default router;
