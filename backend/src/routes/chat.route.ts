import { Router,type Router as ExpressRouter } from "express";
import { authorization } from "../middleware/auth.middleware.js";
import { getAllChat } from "../controllers/chat.controller.js";

const router:ExpressRouter = Router()

router.route("/").get(authorization(),getAllChat)

export default router