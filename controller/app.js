require("dotenv").config({ path: "./.env" });
const express = require("express");
const User = require("../model/user");
const app = express();

app.get("/", (req, res) => {
  res
    .status(200)
    .send("<h1 style='text-align: center'>Welcome to iNeuron</h1>");
});

app.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!(firstname && lastname && email && password)) {
    res.status(400).send("Please enter all the details");
  }

  if (await User.findOne(email)) {
    res.status(400).send("User already has an account");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.status(400).send("Please enter all the details");
  }

  try {
    if (await User.findOne(email)) {
      res.status(200).send("User can login");
    }
  } catch (err) {
    res
      .status(400)
      .send("You first have to create an account. Only then you can login.");
  }
});

module.exports = app;
