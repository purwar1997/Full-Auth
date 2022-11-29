require("../config/database").connect();
require("dotenv").config({ path: "./.env" });
const express = require("express");
const bcrypt = require("brcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const app = express();

// middleware function
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("Authentication system");
});

app.post("/register", async (req, res) => {
  try {
    // getting all the values
    const { firstname, lastname, email, password } = req.body;

    // checking if the user has entered all the details or not
    if (!(firstname && lastname && email && password)) {
      res.status(400).send("Please enter all the details");
    }

    // checking if the email is in a correct format or not
    if (!email.endsWith("@gmail.com")) {
      res.status(400).send("Please enter correct email");
    }

    // checking if the user is already registered or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).send("User already has an account");
    }

    // encrypting the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // adding data to the database

    // Model.create() method creates a document and then save it to the database
    // Model.create(doc) is equivalent to new Model(doc).save()
    // each document inside a mongoDB collection has its own unique id
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: encryptedPassword,
    });

    // create a token and send it to the user

    // sign() is used to create a json web token string
    // jwt string will look like xxxxx.yyyyy.zzzzz
    // (xxxxx => header, yyyyy => payload or data, zzzzz => verified signature )
    // Syntax: jwt.sign(payload, secret or private key, options)

    const token = jwt.sign({ id: user._id }, "js1234590", { expiresIn: "15h" });
    user.token = token;
    await user.save();

    user.password = null;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    console.log("Error is response object");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Please enter all the details");
    }

    if (!email.endsWith("@gmail.com")) {
      res.status(400).send("Please enter correct email");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(200).send("User can login");
    }
  } catch (err) {
    res
      .status(400)
      .send("You first have to create an account. Only then you can login.");
  }
});

module.exports = app;
