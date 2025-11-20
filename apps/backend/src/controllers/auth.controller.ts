import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { bcryptHashPassword, bcryptComparePassword } from "../utils/bcrypt.passwordhash.js";
import { jwtSigh } from "../utils/jwt.js";
import type mongoose from "mongoose";

interface IUser {
    _id: mongoose.Types.ObjectId,
    username: string,
    password: string
}

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { username = "", email = "", password = "" } = req.body
    if (!username.trim() || !email.trim() || !password.trim()) {
        return res.status(400).json({
            success: false,
            message: "You are not providing all fields"
        })
    }

    const userExist = await User.findOne({ email })
    if (userExist) {
        return res.status(400).json({
            success: false,
            message: "User already exist with given email."
        })
    }

    const hashPassword = await bcryptHashPassword(password)
    if (!hashPassword) {
        return res.status(500).json({
            success: false,
            message: "Error while hasing password"
        })
    }

    const user = await User.create({
        username, email, password: hashPassword
    })
    if (!user) {
        return res.status(500).json({
            success: false,
            message: "Error while creating account."
        })
    }
    res.status(200).json({
        success: true,
        message: "User register successfully",
        data: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
})

export const login = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { email = "", password = "" } = req.body
    if (!email.trim() || !password.trim()) {
        return res.status(400).json({
            success: false,
            message: "You are not providing all fields"
        })
    }

    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        return res.status(400).json({
            success: false,
            message: "Sorry user doesn't exist."
        })
    }

    isUserExist!.isOnline = true

    const user = isUserExist as IUser;

    const isPasswordCorrect = await bcryptComparePassword(password, user.password)
    if (!isPasswordCorrect) {
        return res.status(400).json({
            success: false,
            message: "Please enter a right password."
        })
    }

    const token = await jwtSigh({ _id: user?._id, username: user?.username })
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Error while signing jwt."
        })
    }

    await isUserExist?.save()

    res
        .cookie("access_token", token, {
            secure: true,
            httpOnly: true,
            sameSite:"none",
            maxAge: Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
        })
        .status(200)
        .json({
            success: true,
            message: "Login successfully",
            data: {
                _id: user._id,
                username: user.username
            }
        })
})

export const logout = asyncHandler(async (req: CustomRequest, res: Response) => {
    const id = req.user?._id

    const user = await User.findById(id)
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User doesn't exist"
        })
    }

    user.isOnline = false
    await user.save()

    res
        .clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            maxAge: Date.now(),
            sameSite: "none"
        })
        .status(200).json({
            succees: true,
            message: "Logout successfully"
        })
})