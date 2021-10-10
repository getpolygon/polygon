import AuthAPI from "./auth";
import express from "express";
import PostAPI from "./posts";
import CommentAPI from "./comments";
import NetworkAPI from "./network";
import AccountAPI from "./accounts";
import DiscoverAPI from "./discover";
import RelationAPI from "./relations";

const router = express.Router();

router.use("/auth", AuthAPI);
router.use("/posts", PostAPI);
router.use("/network", NetworkAPI);
router.use("/accounts", AccountAPI);
router.use("/comments", CommentAPI);
router.use("/discover", DiscoverAPI);
router.use("/relations", RelationAPI);

export default router;
