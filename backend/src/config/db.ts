import mongoose from "mongoose";
import { db_name } from "./constant.js";

export const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_DB_URL!}/${db_name}`)
        console.log("DB connected at :: ",connection.connections[0]?.host)
    } catch (error) {
        console.log("DB connection fail :: ",error)
        process.exit(1)
    }
}