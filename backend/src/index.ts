import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(cookieParser())
app.use(cors())
app.use(express.json())

import authRoute from "./routes/auth.route.js"


app.use("/api/v1/auth",authRoute)



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