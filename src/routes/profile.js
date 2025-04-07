const express = require('express');
const { userAuth } = require('../middleware/auth');
const User = require('../Model/user');
const { validateEditData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const profileRouter   = express.Router();
const validator = require('validator')

profileRouter.get("/profile/view", userAuth, async(req , res) =>{
    try{
        
        const user = req.user;
      
        res.send(user)
    }catch(err){
        res.send("ERROR: "+err.message)
    }
});

profileRouter.patch("/profile/edit", userAuth,async(req, res) =>{
    try {
        if(!validateEditData(req)){
            throw new Error("Invalid Update")
        }
        const data = req.body
        const loggedInUser = req.user;
         Object.keys(data).forEach(key => loggedInUser[key] = data[key]  )
        //await User.findByIdAndUpdate(loggedInUser._id , data ,{ runValidators: true, new: true});
       await loggedInUser.save();
        res.json({
            message:`${loggedInUser.firstName} your profile is updated successfully`,
            userData : loggedInUser
        })

        
    } catch(err){
        res.send("ERROR: "+err.message)
    }
})

profileRouter.patch("/profile/password" , userAuth ,async(req, res) =>{
    try {
        const user = req.user;
        const {oldPassword , newPassword} = req.body;
        const isPassCorrect = user.validatePassword(oldPassword); 
        if(!isPassCorrect){
            throw new Error("Invalid Old Password");
        }
        if(!validator.isStrongPassword(newPassword)){
            throw new Error ("Enter Strong password")
        }
        
        const newHashedPassword = await  bcrypt.hash(newPassword , 10)


        await User.findByIdAndUpdate(user._id , {password : newHashedPassword} ,{new : true})
        res.send("password updated successfully")
        
    } catch(err){
        res.send("ERROR: "+err.message)
    }
})

profileRouter.get("/user" , async  (req , res) =>{
    const userEmail = req.body.email ;
    
    try {
        const user = await User.find({email : userEmail})
        console.log()
        if(user.length === 0){
            res.status(404).send("User not found")
        }else{
            res.send(user)
        }
    } catch (err) {
        res.status(400).send("something went wrong!!")
    }
});
module.exports = profileRouter;