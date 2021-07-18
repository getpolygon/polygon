import Express from "express";
const router = Express.Router();
import { accounts, posts } from "../../controllers/api/Discover.API.controller";

router.get("/posts", posts);
router.get("/accounts", accounts);

export default router;
