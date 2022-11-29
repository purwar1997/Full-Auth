const mongoose = require("mongoose");
const { MONGODB_URL } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connection successful"))
    .catch((err) => {
      console.log("Database connection failed");
      console.log(err);
      // 0 is a success code, 1 is a failure code
      process.exit(1);
    });
};
