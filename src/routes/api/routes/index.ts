import Express from "express";
const router = Express.Router();

import PostAPI from "../Post.API";
import SearchAPI from "../Search.API";
import CommentAPI from "../Comment.API";
import NetworkAPI from "../Network.API";
import AccountAPI from "../Account.API";
import RelationAPI from "../Relation.API";

router.use("/posts", PostAPI);
router.use("/search", SearchAPI);
router.use("/network", NetworkAPI);
router.use("/accounts", AccountAPI);
router.use("/comments", CommentAPI);
router.use("/relations", RelationAPI);

export default router;
