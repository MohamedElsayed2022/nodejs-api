const mongoose = require('mongoose')
const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        requird : true
    },
    price:{
        type:Number,
        requird:true
    }
})
module.exports = mongoose.model("Course" , courseSchema)