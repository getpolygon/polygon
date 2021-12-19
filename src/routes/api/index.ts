import posts from "./posts";
import users from "./users";
import express from "express";
import upvotes from "./upvotes";
import network from "./network";
import comments from "./comments";
import discover from "./discover";
import relations from "./relations";

const router = express.Router();

router.use("/posts", posts);
router.use("/users", users);
router.use("/upvotes", upvotes);
router.use("/network", network);
router.use("/comments", comments);
router.use("/discover", discover);
router.use("/relations", relations);

export default router;
