const express = require("express");
const userRouter = express.Router();
const UserControll = require("../controllers/userControll");
const userAuth = require("../middleware/userAuth");

userRouter.get("/data", userAuth, UserControll.getUserData);

module.exports = userRouter;
