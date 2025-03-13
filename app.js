const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// routers
const authRouter = require("./routers/authRouter");

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// APIs Endpoints
app.use("/api/auth", authRouter);

module.exports = app;
