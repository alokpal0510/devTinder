const express = require('express');
const { userAuth } = require('../middleware/auth');
const requestRouter = express.Router();
const ConnectionRequest = require('../Model/connectionRequest');
const User = require('../Model/user');

requestRouter.post("/request/send/:status/:toUserId" , userAuth,async( req, res) =>{
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status  = req.params.status;

        if(!["ignored","interested"].includes(status)){
            return res.status(400).json({ message :`${status} is not valid status`});
        }
        const toUser  = await User.findById(toUserId);
        const isIdSame= fromUserId.equals(toUserId);
        if(isIdSame){
            return res.status(400).json({
                message:"cannot send request to yourself"
            })
        }
        if(!toUser){
           return res.status(400).json({message :"user does not exists"})
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or :[
                {fromUserId , toUserId},
                {fromUserId :toUserId , toUserId : fromUserId}
            ]
        })
        if(existingConnectionRequest){
           return res.status(400).json({message : "Connection Request Already Exists!!"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save();
       
        res.json({
            message : "connection request sent successfully",
            data,
        })
    } catch (err) {
        res.send("ERROR: " + err.message)
    }
})
requestRouter.post("/request/review/:status/:requestId" , userAuth , async(req, res) =>{
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        const allowedStatus = ["accepted" , "rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message :"Invalid Status"});
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId : loggedInUser._id,
            status:"interested" 
        })
        if(!connectionRequest){
            return res.status(400).json({message :"connection request not Found !!"})
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({message : "Connection request "+status , data});

        
    } catch (err) {
        res.send("ERROR: " + err.message)
    }
})

module.exports = requestRouter;