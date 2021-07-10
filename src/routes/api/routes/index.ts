import Express from "express";
const router = Express.Router();

import PostAPI from "../Post.API";
import SearchAPI from "../Search.API";
import FriendAPI from "../Friend.API";
import CommentAPI from "../Comment.API";
import NetworkAPI from "../Network.API";
import AccountAPI from "../Account.API";

router.use("/posts", PostAPI);
router.use("/search", SearchAPI);
router.use("/friends", FriendAPI);
router.use("/network", NetworkAPI);
router.use("/accounts", AccountAPI);
router.use("/comments", CommentAPI);

export default router;
