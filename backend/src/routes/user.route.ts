import { Router, type Router as ExpressRouter } from "express";
import { authorization } from "../middleware/auth.middleware.js";
import {
    editUserInfo,
    getActiveUser,
    getAllUser,
    getUserInfo,
    removeUser
} from "../controllers/user.controller.js";

const router: ExpressRouter = Router()

router.route("/active").get(authorization(), getActiveUser)

router.route("/")
    .get(authorization(), getAllUser)
    .patch(authorization(), editUserInfo)
    .delete(authorization(), removeUser)

router.route("/self")
    .get(authorization(), getUserInfo)

export default router