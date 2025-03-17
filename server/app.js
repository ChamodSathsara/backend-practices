const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// routers
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");

// middlewares
const allowedOrigin = ["http://localhost:5173"];
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigin, credentials: true }));

// APIs Endpoints
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

module.exports = app;
