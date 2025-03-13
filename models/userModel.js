const mongoose = require("mongoose");
const Scheema = mongoose.Schema;

const userScheema = new Scheema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
});

const User = mongoose.model.User || mongoose.model("User", userScheema);
module.exports = User;
