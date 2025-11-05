import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { jwtVerify } from "../utils/jwt.js";
import { User } from "../models/user.model.js";
import type mongoose from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id?: mongoose.Types.ObjectId;
                username?: string;
                email?: string
            }
        }
    }
}

interface IUser {
    _id: mongoose.Types.ObjectId,
    username: string,
    email: string
}

export const authorization = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.access_token
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: "You are not authorize 1"
                })
            }

            const isJwtValid = await jwtVerify(token)
            if (!isJwtValid) {
                return res.status(400).json({
                    success: false,
                    message: "You are not authorize 2"
                })
            }

            const isUserExist = await User.findById(isJwtValid._id)
            if (!isUserExist) {
                return res.status(400).json({
                    success: false,
                    message: "User doesn't exist"
                })
            }

            const user = isUserExist as IUser

            if (Date.now() > isJwtValid?.exp*1000) {
                return res
                    .clearCookie("access_token", {
                        httpOnly: true,
                        secure: true,
                        maxAge: Date.now(),
                        sameSite: "none"
                    })
                    .status(400)
                    .json({
                        success: false,
                        message: "Try to login"
                    })
            }

            req.user = {
                _id: user._id,
                username: user?.username,
                email: user?.email
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}