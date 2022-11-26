const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: null,
  },
  lastname: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
    unique: true,
  },
  password: {
    type: String,
    default: null,
    unique: true,
    min: 10,
    max: 15,
  },
  token: {
    type: String,
  },
});

const Model = mongoose.model("user", userSchema);
module.exports = Model;
