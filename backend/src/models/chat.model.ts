import mongoose, { Schema } from "mongoose";

export const chatSchema = new Schema({
    sender:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required:true
    },
    message:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Chat = mongoose.model("Chat",chatSchema)