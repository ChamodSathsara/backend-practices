const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  mongoose.connection.on("connected", () =>
    console.log("mongoDb database Connected")
  );
  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;
