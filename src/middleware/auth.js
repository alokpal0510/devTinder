const jwt = require('jsonwebtoken');
const User = require('../Model/user');

const userAuth = async (req , res , next) => {
    try{const {token} = req.cookies
    if(!token){
        throw new Error("Invalid token !!!!")

    }

    const decodedobj =  await jwt.verify(token ,"DEV@Tinder0510");
    const{_id} = decodedobj;
    const user = await User.findById(_id);

    if(!user){
        throw new Error("User Not Found")
    }
    req.user = user;
    next()

    }catch(err){
        res.send("ERROR: "+err.message)
    }
    
};

module.exports = {
    userAuth,
    
}