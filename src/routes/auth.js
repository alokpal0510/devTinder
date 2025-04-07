const express = require('express')
const validator = require('validator')
const authRouter = express.Router();
const {signUpValidation} = require('../utils/validation')
const User = require('../Model/user');
const bcrypt = require('bcrypt')

authRouter.post("/signup" , async (req , res) =>{
    try{ 
    // validate the data 
    signUpValidation(req)

    const {firstName , lastName, email , password} = req.body

    // encrypt the password 
    const passwordHash = await bcrypt.hash(password , 10)

    //then create the instance of the User model

    const user = new User({
        firstName, 
        lastName , 
        email, 
        password :passwordHash
    })
    await user.save()
    res.send("user added to db successfully")
    }catch(err){
        res.status(400).send( "ERROR : "+err.message)
    }

});

authRouter.post("/login" , async (req , res) =>{
    try{
        const {email , password} = req.body
        if( ! validator.isEmail(email) ){
            throw new Error("Enter a valid Email address")

        }
        const user = await User.findOne({email : email})
        if(!user){
            throw new Error("Invalid Credetials")
        }
        const isPasswordValid = await user.validatePassword(password )
        if(isPasswordValid){

            // creating jwt token 
            const token = await user.getJWT()
           // console.log(token)
            res.cookie("token", token ,{expires:new Date(Date.now() + 8*36000000)})

            // adding it to cookie and sending to client 
            res.send("logged in succesfully")
        }
        else{
            throw new Error("Invalid credentials")
        }
            
    }catch(err){
        res.status(400).send("ERROR: " + err.message )
    }
})

authRouter.post("/logout" , async (req , res) =>{
    res.cookie("token" , null , {
        expires:new Date(Date.now())
    })
    .send("User logged out Successfully")
})

module.exports = authRouter;