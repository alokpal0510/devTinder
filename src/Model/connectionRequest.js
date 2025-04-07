const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId :{
        type :mongoose.Schema.Types.ObjectId,
        required:true,
        ref :"User"
    },
    toUserId:{
        type :mongoose.Schema.Types.ObjectId,
         ref :"User",
        required :true
    },
    status:{
        type:String,
        enum :{
            values :["interested" , "ignored", "accepted","rejected"],
            message :`{VALUE} is not in values`
        }
    },
    
},{
        timestamps :true
    }
)
connectionRequestSchema.index({fromUserId:1 , toUserId:1});



const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel",connectionRequestSchema)



module.exports = ConnectionRequestModel;