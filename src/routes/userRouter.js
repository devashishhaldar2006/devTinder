const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { parse } = require("dotenv");

const USER_SAFE_FIELDS = ["name", "photoUrl", "skills", "about"];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_FIELDS);

    res.json({
      message: "Connection requests fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status : "accepted" },
      ],
    }).populate("fromUserId toUserId", USER_SAFE_FIELDS);
    res.json({
      message: "Connections fetched successfully",
      data: connections,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id},
        { toUserId: loggedInUser._id},
      ],
    }).select("fromUserId toUserId")


    const hideUsersFromFeed=new Set();
    connections.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: [...hideUsersFromFeed] } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_FIELDS).skip(skip).limit(limit);

    res.json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = userRouter;
