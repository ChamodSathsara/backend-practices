const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const transporter = require("../config/nodemailer");

const logingUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({ message: "email of password missing", status: 400 });
  }

  try {
    // check email is correct
    const newUser = await User.findOne({ email });

    if (!newUser) {
      res.json({ success: false, message: "invalied email " });
    }

    // check password is correct
    const isMatch = await bcrypt.compare(password, newUser.password);
    if (!isMatch) {
      res.json({ success: false, message: "invalied Password " });
    }

    // create token
    const token = jwt.sign({ id: newUser._id }, process.env.TOKEN_KEY, {
      expiresIn: "7d",
    });
    // create cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ message: "email of password missing", status: 400 });
  }

  try {
    // check email already exisisting
    const exsistingUser = User.findOne({ email });
    if (!exsistingUser.obj === undefined) {
      return res.json({ message: "email elready using", status: 400 });
    }

    // password encript
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new User for save
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // save user
    await newUser.save();

    // create token
    const token = jwt.sign({ id: newUser._id }, process.env.TOKEN_KEY, {
      expiresIn: "7d",
    });

    // create cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // send email for wellcome
    const mailoption = {
      from: process.env.SENDER_EMAIL,
      to: newUser.email,
      subject: "Welcome to Chamod Site",
      text: "successfully create your account and your email eddress is : ",
    };

    const sended = await transporter.sendMail(mailoption);

    return res.json({ success: true });
  } catch (error) {
    return res.json({
      success: false,
      error,
      message: error.message,
      status: 400,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({ success: true, message: "log out" });
  } catch (error) {
    res.json({ success: false, message: error.message, status: 400 });
  }
};

// send verification OTP to user mail
const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (user.isAccountVerified) {
      res.json({
        success: false,
        message: "account allready verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;

    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    const aa = await user.save();

    const mailoption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verification Code",
      text: "Your verification code is you can add it " + otp,
    };

    const bb = await transporter.sendMail(mailoption);

    res.json({
      success: true,
      message: "Verification code it sended on Email",
    });
  } catch (error) {
    res.json({ success: false, error: error, status: 400, message: "sssss" });
  }
};

// veryfy account using sended otp
const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    res.json({
      success: false,
      message: "user or otp Missing",
      status: 400,
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.json({
        success: false,
        message: "user not found",
        status: 400,
      });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      res.json({
        success: false,
        message: "otp invalied",
        status: 400,
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      res.json({
        success: false,
        message: "otp expired",
        status: 400,
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "email verify successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message, status: 400 });
  }
};

const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// send reset otp
const sendRestOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: "false", message: "correct email requid" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;

    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailoption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password reset Code",
      text: `Your reset code is ${otp}. you can add it `,
    };

    await transporter.sendMail(mailoption);

    res.json({
      success: true,
      message: "password reset code is sended on Email",
    });
  } catch (error) {
    return res.json({ success: "false", message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!otp || !email || !newPassword) {
    return res.json({ success: false, message: "details required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Not found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      res.json({
        success: false,
        message: "otp invalied",
        status: 400,
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      res.json({
        success: false,
        message: "otp expired",
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "password change successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.logingUser = logingUser;
exports.logoutUser = logoutUser;
exports.registerUser = registerUser;
exports.sendVerifyOtp = sendVerifyOtp;
exports.verifyEmail = verifyEmail;
exports.isAuthenticated = isAuthenticated;
exports.sendRestOtp = sendRestOtp;
exports.resetPassword = resetPassword;
