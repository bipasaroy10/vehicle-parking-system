import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//routes
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import ownerRoutes from "./routes/owner.route.js";


app.use("/api/owner", ownerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

export default app;