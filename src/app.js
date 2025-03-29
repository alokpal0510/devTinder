const express = require("express")

const app =  express()

app.use("/about" , (req , res) =>{
    res.send("welcome to about page")
})
app.use (( req , res) =>{
    res.send("welcome to page")
})

app.listen(7777 , () =>{
    console.log("server is running at port 7777")
})