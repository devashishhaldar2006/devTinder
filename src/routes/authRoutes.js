const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);
    const { name, email, password } = req.body;
    //encryption of password
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashPassword,
    });
    await user.save();
    res.status(201).send("user data saved");
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send("Invalid credentials");
    }
    // create a JWT token
    const token = await jwt.sign({ userId: user._id }, "deva", {
      expiresIn: "7d",
    });
    // add the token to cookie and send the response
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.status(200).send("login successful");
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send("logout successful");
});

module.exports = authRouter;
