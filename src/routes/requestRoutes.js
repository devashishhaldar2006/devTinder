const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req, res) => {
    try {
       const fromUserId=req.user._id;
       const toUserId=req.params.toUserId;
       const status=req.params.status;
       const connectionRequest=new connectionRequest({fromUserId,toUserId,status});
       const data=await connectionRequest.save();
       res.json({
        message:"Connection request sent",
        data
       })
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports=requestRouter;
