import express from "express";
import cors from "cors";
import morgan from "morgan";

import api from "@/routers";
import { toNodeHandler } from "better-auth/node";
import auth from "@lib/auth";
import requireAuth from "@middlewares/requireAuth";

// Monte tous les routeurs de /routers

const app = express();

app.use(morgan("combined"));

// use some application-level middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.options("*any", cors());

// Auth middlewares
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

// import and mount the API routes
app.use("/api", requireAuth, api);

export default app;
