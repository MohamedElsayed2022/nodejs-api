const express = require("express");
const courseController = require("../controllers/courses.controller");
const { body } = require("express-validator");
const { validationschema } = require("../middleware/validationSchema");
const generateToken = require("../middleware/generateToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middleware/allowedTo");

const router = express.Router();

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(
    generateToken , allowedTo(userRoles.MANAGER),
  validationschema(),
    
    courseController.addCourse
  );

router
  .route("/:courseId")
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete( generateToken , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , courseController.deleteCourse);

module.exports = router;
