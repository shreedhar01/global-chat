import mongoose, { Schema } from "mongoose";

export const messageSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    messageType: {
        type: String,
        enum: ["text", "image", "video", "file"],
        default: "text"
    },

    message: { type: String },

    mediaUrl: { type: String },

    isRead: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    readAt: { type: Date }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
