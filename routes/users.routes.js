const express = require("express");
const courseController = require("../controllers/courses.controller");
const { body } = require("express-validator");
const { validationschema } = require("../middleware/validationSchema");
const multer  = require('multer')

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File Name :- ", file)
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1]
    const fileName = `user-${Date.now()}.${ext}`
    cb(null, fileName)
  }
})
const fileFilter = (req , file , cb)=>{
  const imageType = file.mimetype.split('/')[0]
  if(imageType === 'image'){
   return cb(null, true)

  }else{
    return cb(appError.create("That Not Allowed pdf" , 400 ) , false)
  }
}
const upload = multer({ 
  storage:diskStorage,
  fileFilter:fileFilter

 })
const router = express.Router();
 const usersController = require('../controllers/users.contrller');
const generateToken = require("../middleware/generateToken");
const appError = require("../utils/appError");
//get All Users

//register

//login

router
  .route("/")
  .get(generateToken ,  usersController.getAllUsers)

  router
  .route("/register")
  .post(upload.single('avatar'),usersController.register)

  router
  .route("/login")
  .post(usersController.login)

  


module.exports = router;
