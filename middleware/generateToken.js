const jwt = require('jsonwebtoken');
const HttpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

const generateToken = async (req, res, next) => {
  const authHeader = req.headers['Authorization'] || req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json("Token is required");
  }

  const token = authHeader.split(" ")[1];

  try {
    const currentUser = await jwt.verify(token, process.env.SECRET_KEY);
    req.currentUser = currentUser;
    console.log(currentUser); // Changed from 'decodedToken' to 'currentUser'
    next();
  } catch (err) {
    const error = appError.create("Invalid Token", 401, HttpStatusText.ERROR);
    return next(error);
  }
}

module.exports = generateToken;




























// const jwt = require('jsonwebtoken')
// const HttpStatusText = require('../utils/httpStatusText')
// const appError = require('../utils/appError')
// const generateToken = async(req , res , next )=>{
//     const autHeader = req.headers['Authorization'] ||  req.headers['authorization']
//     if(!autHeader){
//         return res.status(401).json("Token is Requred")
//     }
//     const token = autHeader.split(" ")[1]
//     try{
      
//         const currentUser =await jwt.verify(token , process.env.SECRET_KEY)
//         req.currentUser = currentUser
//         console.log( decodedToken)
//         next()

//     }catch(err){
//         const error = appError.create("Invalid Token" , 401 , HttpStatusText.ERROR)
//         return next(error)
//     }
    
// }

// module.exports = generateToken