import express, { type Request, type Response } from "express"
import { connectDB } from "./config/db.js"

const app = express()

connectDB()
    .then(()=>{
        const port = process.env.PORT ?? 3000
        const server = app.listen(port,()=>{
            console.log("Server start at :: ", port)
        })
        server.on("error",(error)=>{
            console.log("Error on server :: ",error)
        })
    }).catch((error)=>{
        console.log("Error while connecting to DB :: ",error)
    })