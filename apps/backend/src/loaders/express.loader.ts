import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "../api-v1/routes/auth.route.js";
import userRoute from "../api-v1/routes/user.route.js";
import chatRoute from "../api-v1/routes/chat.route.js";

export const loadExpress = (): express.Application => {
  const app = express();

  app.use(cookieParser());
  app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/chat", chatRoute);

  return app;
};
