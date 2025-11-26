import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    profilePic: { type: String },

    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date },

    socketId: { type: String }, // useful for socket.io
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
