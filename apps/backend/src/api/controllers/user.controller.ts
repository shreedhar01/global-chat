import type { Request, Response } from "express";
import { asyncHandler } from "../../services/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { bcryptHashPassword } from "../../services/bcrypt.passwordhash.js";

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
    const allUser = await User.countDocuments()
    if (!allUser) {
        return res.status(400).json({
            success: false,
            message: "Failed to get all user"
        })
    }
    res.status(200).json({
        success: true,
        message: "All user fetch success",
        data: {
            allUser
        }
    })
})

export const getUserInfo = asyncHandler(async (req: CustomRequest, res: Response) => {
    const _id = req.user?._id

    const user = await User.findById(_id).select("-password")
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User not found"
        })
    }

    res.status(200).json({
        success: true,
        message: "user info fetch successfully.",
        data: {
            user
        }
    })
})

export const editUserInfo = asyncHandler(async (req: CustomRequest, res: Response) => {
    const id = req.user?._id
    const { username = "", password = "" } = req.body

    if (!username.trim() && !password.trim()) {
        return res.status(400).json({
            success: false,
            message: "Provide any field"
        })
    }

    const user = await User.findById(id).select("-password")
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User not exist"
        })
    }

    if (password.trim()) {
        const hashPassword = await bcryptHashPassword(password)
        user.password = hashPassword
    }

    if (username.trim()) {
        user.username = username
    }

    const userSave = await user.save()
    if (!userSave) {
        return res.status(400).json({
            success: false,
            message: "User info not save"
        })
    }

    res.status(200).json({
        success:true,
        message:"User info edited successfully",
        data:userSave
    })
})

export const removeUser = asyncHandler(async(req:CustomRequest,res:Response)=>{
    const id = req.user?._id

    const remove = await User.deleteOne({_id:id})
    if(!remove){
        return res.status(400).json({
            success:false,
            message:"User not remove"
        })
    }

    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})

export const getActiveUser = asyncHandler(async(req:Request,res:Response)=>{
    const onlineUsers = await User.find({isOnline:true}).select("username")
    if(!onlineUsers){
        return res.status(400).json({
            success:false,
            message:"Unable to fetch online user"
        })
    }

    res.status(200).json({
        success:true,
        message:"Online user fetch successfully",
        data:onlineUsers
    })
})
