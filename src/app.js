const express = require("express")
const app =  express()
const connectDB = require("./config/database")
const User = require("./Model/user")
const cookieparser= require('cookie-parser')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const  userRouter  = require("./routes/user")
app.use(express.json())
app.use(cookieparser())

app.use('/', authRouter);
app.use('/' , profileRouter);
app.use('/',requestRouter);
app.use('/' , userRouter)



connectDB()
.then( () =>{
    console.log("database connected succesfully"),
    app.listen(7777 , () => {
        console.log("server is running at port 7777")
    })
})
.catch(
    (err) => {
        console.error("database cannot be connected")
    }
    
)



    
