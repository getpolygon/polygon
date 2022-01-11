import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { uuidValidator } from "middleware/uuidValidator";
import { posts, withCursor } from "api/controllers/discover";

const router = express.Router();

const applyLocalValidators = () =>
  celebrate(
    {
      [Segments.QUERY]: {
        limit: Joi.number().greater(1).less(10).default(2),
      },
    },
    {
      cache: true,
      abortEarly: true,
      stripUnknown: true,
      allowUnknown: false,
    }
  );

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
