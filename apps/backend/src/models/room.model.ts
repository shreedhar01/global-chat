import mongoose, { Schema } from "mongoose";

export const roomSchema = new Schema({
    participants: [
        { type: Schema.Types.ObjectId, ref: "User" }
    ],

    isGroup: { type: Boolean, default: false },

    groupName: { type: String },
    groupImage: { type: String },

    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    }
}, { timestamps: true });

export const Room = mongoose.model("Room", roomSchema);
