// let { courses } = require("../Data/courses");
const { validationResult } = require("express-validator");
const Course = require('../models/course.model')
const HttpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require('../utils/appError')
const getAllCourses =asyncWrapper( async (req, res) => {
  
    const query = req.query
    const limit = query.limit || 10
    const page = query.page || 1
    const skip = (page - 1) * limit
    console.log("Query ==> ",query)
    const courses = await Course.find({},{"__v" :false}).limit(limit).skip(skip);
    res.json({status :HttpStatusText.SUCCESS  , data: {courses}});
  
})

const getCourse = asyncWrapper(
async(req, res , next) => {
  const course = await Course.findById(req.params.courseId); // يُفضل استخدام await إذا كنت تستخدم Promises
  if (!course) {

    const error = appError.create(" Course Not Found " , 404 , HttpStatusText.FAIL)
    return next(error)
    // return res.status(404).json({status: HttpStatusText.FAIL, data: { course : "Not Found" }});
  }
  return res.json({ status: HttpStatusText.SUCCESS, data: { course } });
  
});

const addCourse =asyncWrapper( async(req, res,next) => {
  console.log(req.body);
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = appError.create(error.array(), 400 ,HttpStatusText.FAIL )
    return next(error)
    // return res.status(400).json({status: HttpStatusText.FAIL, data:null , message:"Invalid Object ID",data: {errors : error.array()} });
  }

  // const course = { id: courses.length + 1, ...req.body };
  // courses.push(course);
  const newCourse =  new Course(req.body)
  await newCourse.save()
  res.status(201).json({status :HttpStatusText.SUCCESS  , data: {course :newCourse}});
});

const updateCourse = async (req, res) => {
  const courseId = req.params.courseId
    const updatedCourse = await Course.updateOne({_id:courseId} , {$set:{...req.body}})
    return res.status(200).json({status : HttpStatusText.SUCCESS , data : {course : updatedCourse}});

};
const deleteCourse =asyncWrapper( async (req , res)=>{
      // courses = courses.filter((course)=>course.id !== courseID)
    const courseID = req.params.courseId
    await Course.deleteOne({_id:courseID})
    res.status(200).json({status :HttpStatusText.SUCCESS , data: null})
})

module.exports = {
    addCourse,
    deleteCourse,
    updateCourse,
    getAllCourses,
    getCourse
}
