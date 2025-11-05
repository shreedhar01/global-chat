import { Router, type Router as ExpressRouter } from "express";
import { login, register,logout } from "../controllers/auth.controller.js";
import { authorization } from "../middleware/auth.middleware.js";

const router: ExpressRouter = Router()

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/logout").post(authorization(),logout)


export default router