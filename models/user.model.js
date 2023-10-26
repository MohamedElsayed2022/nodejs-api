const mongoose = require("mongoose");
const validator = require('validator');
const userRoles = require("../utils/userRoles");
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate:[validator.isEmail , "Feild Must Be A Valid"]
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type:String
  },
  role : {
    type: String,
    enum:[userRoles.ADMIN , userRoles.MANAGER , userRoles.USER],
    default : userRoles.USER
  } ,
  avatar : {
    type:String,
    default : '../uploads/profile.jpg'
  }
});
module.exports = mongoose.model("User", UserSchema);
