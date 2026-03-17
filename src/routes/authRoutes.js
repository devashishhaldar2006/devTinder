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
    return res.status(201).send("user data saved");
  } catch (error) {
    return res.status(400).send(error.message || "Signup failed");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
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
    return res.status(200).send(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Login failed" });
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).send("logout successful");
});

module.exports = authRouter;
