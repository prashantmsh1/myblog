import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const app = express();
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : err.statusCode;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        message,
        statusCode,
        message,
    });
});
