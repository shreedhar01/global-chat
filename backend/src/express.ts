import express, { type Express } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"

const app: Express = express()

app.use(cookieParser())
app.use(cors())
app.use(express.json())


app.use("/api/v1/auth", authRoute)
app.use("/api/v1/user", userRoute)


export default app