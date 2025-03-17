const User = require("../models/userModel");

const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "user Id requied" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    return res.json({
      success: true,
      userData: { email: user.email, isVerify: user.isAccountVerified },
      message: "user data sended",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.getUserData = getUserData;
