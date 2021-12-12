import express from "express";
import { uuidValidator } from "util/uuidValidator";
import { celebrate, Joi, Segments } from "celebrate";
import { one, create, remove, ofUser } from "controllers/api/posts";

const router = express.Router();

// To fetch only one post with ID
router.get("/only/:id", uuidValidator(), one);

// To fetch posts of an account
// prettier-ignore
router.get("/:username", celebrate({ [Segments.PARAMS]: { username: Joi.string().exist() }}), ofUser);

// To delete a post
router.delete("/:id/delete", uuidValidator(), remove);

// To create a post
// prettier-ignore
router.post("/create", celebrate({
    [Segments.BODY]: {
        title: Joi.string().max(100).exist(),
        content: Joi.string().optional().default(null),
      }
    },
  ),
  create
);

export default router;
