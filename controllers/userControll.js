const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const transporter = require("../config/nodemailer");

const logingUser = async (req, res, next) => {
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
    const token = jwt.sign({ email: newUser.email }, process.env.TOKEN_KEY, {
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
    const token = jwt.sign({ email: newUser.email }, process.env.TOKEN_KEY, {
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

    await user.save();

    const mailoption = {
      from: process.env.SENDER_EMAIL,
      to: newUser.email,
      subject: "Verification Code",
      text: `Your verification code is $(opt) you can add it `,
    };

    await transporter.sendMail(mailoption);

    res.json({
      success: true,
      message: "Verification code it sended on Email",
    });
  } catch (error) {
    res.json({ success: false, message: error.message, status: 400 });
  }
};

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
    const user = User.findById(userId);

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

exports.logingUser = logingUser;
exports.logoutUser = logoutUser;
exports.registerUser = registerUser;
exports.sendVerifyOtp = sendVerifyOtp;
exports.verifyEmail = verifyEmail;
