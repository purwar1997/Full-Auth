const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: null,
    required: [true, "Firstname is required"],
    lowercase: true,
    trim: true,
  },
  lastname: {
    type: String,
    default: null,
    required: [true, "Lastname is required"],
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    trim: true,
  },
  password: {
    type: String,
    unique: true,
    required: [true, "Password is required"],
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
