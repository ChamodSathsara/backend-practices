const express = require("express");
const router = express.Router();
const userControll = require("../controllers/userControll");
const authUser = require("../middleware/userAuth");

router.post("/login", userControll.logingUser);
router.post("/register", userControll.registerUser);
router.post("/logout", userControll.logoutUser);
router.post("/send-verify-otp", authUser, userControll.sendVerifyOtp);
router.post("/verify-account", authUser, userControll.verifyEmail);
router.post("/is-auth", authUser, userControll.isAuthenticated);
router.post("/send-reset-otp", userControll.sendRestOtp);
router.post("/reset-password", userControll.resetPassword);

module.exports = router;
