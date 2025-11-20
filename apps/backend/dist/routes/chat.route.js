import { Router } from "express";
import { authorization } from "../middleware/auth.middleware.js";
import { getAllChat } from "../controllers/chat.controller.js";
const router = Router();
router.route("/").get(authorization(), getAllChat);
export default router;
//# sourceMappingURL=chat.route.js.map