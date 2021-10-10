import AuthAPI from "./auth";
import express from "express";
import PostAPI from "./Post.API";
import CommentAPI from "./Comment.API";
import NetworkAPI from "./Network.API";
import AccountAPI from "./Account.API";
import DiscoverAPI from "./Discover.API";
import RelationAPI from "./Relation.API";

const router = express.Router();

router.use("/auth", AuthAPI);
router.use("/posts", PostAPI);
router.use("/network", NetworkAPI);
router.use("/accounts", AccountAPI);
router.use("/comments", CommentAPI);
router.use("/discover", DiscoverAPI);
router.use("/relations", RelationAPI);

export default router;
