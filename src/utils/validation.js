
const validator = require('validator')
const signUpValidation = (req) =>{
    const {firstName , lastName , email , password} = req.body

    if(!firstName || !lastName) {
        throw new Error ("Please enter valid Name")
    }

    else if(!validator.isEmail(email)){
        throw new Error ("Please enter valid Email address")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error ("Please enter a strong password")
    }
}

const validateEditData = (req) =>{
    const allowedEditFields = ['firstName', 'lastName','age' ,'gender','photoUrl', 'about', 'skills'];
    const isallowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    
    
 
    return isallowed;
    


}
module.exports = {
    signUpValidation,
    validateEditData
}