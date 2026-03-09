const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true    
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["pending","accepted","rejected"],
            message:"{VALUE} is not supported"
        }
    }

},{
    timestamps:true
})


module.exports=mongoose.model("ConnectionRequest",connectionRequestSchema);