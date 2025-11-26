import type { Request, Response } from "express";
import { asyncHandler } from "../../services/asyncHandler.js";
import { Chat } from "../models/chat.model.js";

export const getAllChat = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const totalChat = await Chat.countDocuments()
    const totalPage = Math.ceil(totalChat / limit)

    const allChat = await Chat
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("sender","username")

    if (!allChat) {
        return res.status(400).json({
            success: false,
            message: "Unable to fetch chat"
        })
    }

    if (allChat.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No chats found",
            data: {
                chat: [],
                page,
                limit,
                totalPage
            }
        });
    }

    res.status(200).json({
        success: true,
        message: "Chat fetch successfully",
        data: {
            chat: allChat,
            page,
            limit,
            totalPage
        }
    })
})