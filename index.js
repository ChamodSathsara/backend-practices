const app = require("./app");
const mongoose = require("mongoose");
const ConnectDb = require("./config/mongoDb");

// listen
app.listen(process.env.PORT, () => {
  console.log("server runnging...", process.env.PORT);
});

ConnectDb();
