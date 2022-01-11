import auth from "./auth";
import posts from "./posts";
import users from "./users";
import express from "express";
import upvotes from "./upvotes";
import network from "./network";
import comments from "./comments";
import discover from "./discover";
import relations from "./relations";
import authenticate from "middleware/authenticate";

const router = express.Router();

router.use("/auth", auth);
router.use("/posts", authenticate(), posts);
router.use("/users", authenticate(), users);
router.use("/upvotes", authenticate(), upvotes);
router.use("/network", authenticate(), network);
router.use("/comments", authenticate(), comments);
router.use("/discover", authenticate(), discover);
router.use("/relations", authenticate(), relations);

export default router;
