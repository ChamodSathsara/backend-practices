const express = require("express");
const router = express.Router();
const userControll = require("../controllers/userControll");

router.get("/login", userControll.logingUser);
router.post("/register", userControll.registerUser);
router.post("/logout", userControll.logoutUser);

module.exports = router;
