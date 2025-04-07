const mongoose = require('mongoose')

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://alokpal:sCEufx09UsFdEuCi@namastenode.bugmks6.mongodb.net/devTinder")
}

module.exports = connectDB