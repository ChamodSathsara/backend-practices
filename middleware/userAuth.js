const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({
      success: false,
      message: "authorixzed problem , Loging again",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.TOKEN_KEY);

    console.log(tokenDecode.id);

    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "authorixzed problem , Loging again",
      });
    }

    next();
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = userAuth;
