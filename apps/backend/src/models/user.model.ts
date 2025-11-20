import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isOnline:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export const User = mongoose.model("User",userSchema)