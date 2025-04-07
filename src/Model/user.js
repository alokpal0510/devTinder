const mongoose = require('mongoose')
const validator = require('validator')
const  jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userSchema  = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required :true,
            minLength : 4,
            maxLength : 50
        },
        lastName :{
            type : String
        },
        email:{
            type:String,
            required:true,
            unique : true ,
            lowercase:true ,
            trim : true ,
           validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Enter Valid Email Id : " + value)
            }
           }
        },
        password:{
            type:String,
            required : true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter strong password : ")
                }
            }
        },
        age:{
            type:Number,
            min :18 
        },
        gender :{
            type:String,
            enum:{
                values:["male" ,"female","other"],
                message :`{VALUE} is not a valid gender`
            }
            // validate(value){
            //     if(!['male', 'female', 'other'].includes(value)){
            //         throw new Error ("Enter valid gender data: ")
            //     }
            // }
        },
        photoUrl :{
            type :String,
            validate(value){
                if(!validator.isURL(value)){
                    throw  new Error("Enter valid url" +value)
                }
            }
        },
        about :{
            type :String ,
            default :"This is default about user"
        },
        skills :{
            type :[String]
        },
    },
    {
        timestamps: true 
    }
)

userSchema.methods.getJWT = async function (){
    const user = this;
    const token = await jwt.sign({_id : user._id}, "DEV@Tinder0510" ,{expiresIn :"7d"});
    return token ;

}

userSchema.methods.validatePassword = async function (userInputPassword){
    const user = this ;
    const isPasswordValid = bcrypt.compare(userInputPassword , user.password)
    return isPasswordValid;
}
// here we are creating a model for our schema which allows us to create new instsances of our schema 
const User = mongoose.model("User" , userSchema)

module.exports = User