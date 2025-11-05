import jwt from "jsonwebtoken"
import type mongoose from "mongoose"

export interface IPlayload{
    _id:mongoose.Types.ObjectId,
    username:string
}

export interface IJwtPlayload extends IPlayload{
    exp:number,
    iat:number
}

export const jwtSigh = async(token:IPlayload)=>{
    return await jwt.sign(token,process.env.JWT_SECRET!,{
        expiresIn:process.env.JWT_EXPIRE as any
    })
}

export const jwtVerify = async(token:string)=>{
    return await jwt.verify(token,process.env.JWT_SECRET!) as IJwtPlayload
}