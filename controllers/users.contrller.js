const asyncWrapper = require("../middleware/asyncWrapper")
const User = require('../models/user.model')
const appError = require('../utils/appError')
const bycryt = require('bcrypt')
const HttpStatusText = require('../utils/httpStatusText')
const jwt = require('jsonwebtoken')
const generateJWT = require("../utils/generateJWT")
const getAllUsers = asyncWrapper( async (req, res) => {
  
    const query = req.query
    const limit = query.limit || 10
    const page = query.page || 1
    const skip = (page - 1) * limit
    console.log("Query ==> ",query)
    const users = await User.find({},{"__v" :false , "password" : false}).limit(limit).skip(skip);
    res.json({status :HttpStatusText.SUCCESS  , data: {users}});
  
})

const register = asyncWrapper(async(req , res , next)=>{
    console.log(req.body)
    const {firstName , lastName , email , password , role} = req.body
    const fileName = req.file
    console.log("File Name :- " , fileName)
    const OldUser =await User.findOne({email : email})
    if(OldUser){
        const error = appError.create("User Already Existed !" , 400 , HttpStatusText.ERROR)
        return next(error)
    }

    //password hasing
    const hashedPassword = await bycryt.hash(password , 10)
     
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        avatar : fileName.filename
    })
    
    //generate jwt token
   const token =await generateJWT({email : newUser.email , id : newUser._id , role : newUser.role})
    newUser.token = token
  
    await newUser.save()
    return res.status(201).json({status : HttpStatusText.SUCCESS , data: {user : newUser}})


})

const login = asyncWrapper(async(req , res , next)=>{
     const {password , email} = req.body
     if(!email && !password){
        const error = appError.create("Email And Password Are Required " , 400 , HttpStatusText.FAIL )
        return next(error)
     }
     const user =await User.findOne({email :email})
     if(!user){
        const error = appError.create("User Not FOund " , 500 , HttpStatusText.ERROR )
        return next(error)
    }
     const matchedPassword = await bycryt.compare(password , user.password)
    if(!matchedPassword){
        const error = appError.create("Password Wrong " , 500 , HttpStatusText.ERROR )
        return next(error)
    }
     if(user && matchedPassword){
        const token =await generateJWT({email : user.email , id : user._id , role: user.role })

        return res.json({status : HttpStatusText.SUCCESS , data: {token}})
     }else{
        const error = appError.create("Email OR Password invalid " , 500 , HttpStatusText.ERROR )
        return next(error)
     }
})

module.exports = {
    getAllUsers,
    register,
    login
}