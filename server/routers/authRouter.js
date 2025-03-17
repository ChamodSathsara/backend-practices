const express = require("express");
const router = express.Router();
const authControll = require("../controllers/authControll");
const authUser = require("../middleware/userAuth");

router.post("/login", authControll.logingUser);
router.post("/register", authControll.registerUser);
router.post("/logout", authControll.logoutUser);
router.post("/send-verify-otp", authUser, authControll.sendVerifyOtp);
router.post("/verify-account", authUser, authControll.verifyEmail);
router.get("/is-auth", authUser, authControll.isAuthenticated);
router.post("/send-reset-otp", authControll.sendRestOtp);
router.post("/reset-password", authControll.resetPassword);

module.exports = router;
