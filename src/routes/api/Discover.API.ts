import Express from "express";
import { accounts, posts } from "../../controllers/api/Discover.API.controller";

const router = Express.Router();

router.get("/posts", posts);
router.get("/accounts", accounts);

export default router;
