require("dotenv").config({ path: "./.env" });
require("../config/database").connect();
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// importing models
const User = require("../model/user");

// importing custom middlewares
const auth = require("../middleware/auth");

const { SECRET_KEY: secretKey, TOKEN_EXPIRES_IN: expireTime } = process.env;

// use() method is used to load middleware functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookieParser() loads the cookie data into req object (req.cookies)
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).send("Authentication system");
});

app.post("/register", async (req, res) => {
  try {
    // getting all the data
    const { firstname, lastname, email, password } = req.body;

    // checking if the user has entered all the details or not
    if (!(firstname && lastname && email && password)) {
      res.status(401).send("Please enter all the details");
    }

    // checking if the email is in correct format or not
    if (!email.endsWith("@gmail.com")) {
      res.status(401).send("Please enter correct email");
    }

    // checking if the user is registered or not
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
    // (xxxxx => header, yyyyy => payload or data, zzzzz => verified signature)
    // Syntax: jwt.sign(payload, secret or private key, options)

    const token = jwt.sign({ id: user._id }, secretKey, {
      expiresIn: expireTime,
    });
    user.token = token;
    await user.save();

    user.password = undefined;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    console.log("Error thrown!");
  }
});

app.post("/login", async (req, res) => {
  try {
    // getting all the data
    const { email, password } = req.body;

    // checking if the user has entered all the details or not
    if (!(email && password)) {
      res.status(401).send("Please enter all the details");
    }

    // checking if the email is in correct format or not
    if (!email.endsWith("@gmail.com")) {
      res.status(401).send("Please enter correct email");
    }

    // checking if the user is registered or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User account exists in our database");

      // encrypting the password
      // const encryptedPassword = await bcrypt.hash(password, 10);

      // // matching the password
      // if (encryptedPassword === existingUser.password) {
      //   // sending a token directly to the user
      //   res.status(200).json({ token: existingUser.token });
      // }

      // another way to match the password
      if (await bcrypt.compare(password, existingUser.password)) {
        // create a token and send it via cookies
        const token = jwt.sign({ id: existingUser._id }, secretKey, {
          expiresIn: expireTime,
        });

        // defining options for the cookie
        const options = {
          // Date.now() returns the no of milliseconds that have passed since Jan 1, 1970
          // new Date() returns a date object based on the no of milliseconds
          // that have passed since Jan 1, 1970
          // new Date() and new Date(Date.now()) returns the same date object i.e. current date

          expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          // maxAge property can be used instead of expires property
          // maxAge: 432000000 (milliseconds that represent 5 days from now)
          // httpOnly property ensures that only web server can access the cookie
          httpOnly: true,
        };

        // creating and sending a cookie to the user
        res
          .status(200)
          .cookie("token", token, options)
          .json({ success: true, message: "User can now login" });
      } else {
        res.status(401).send("Please enter correct password");
      }
    } else {
      res
        .status(400)
        .send("User first has to register. Only then he can login.");
    }
  } catch (err) {
    console.log(err);
    console.log("Error thrown!");
  }
});

app.get("/dashboard", auth, (req, res) => {
  res.status(200).send("Welcome to dashboard");
});

app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findOne(req.user._id);

    if (user) {
      res.status(200).json({ userData: user });
    }
  } catch (err) {
    res.status(403).send("User doesn't exist");
  }
});

module.exports = app;
