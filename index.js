const express = require("express");
require('dotenv').config()
const app = express();
const path = require('path')
const cors = require('cors')
const httpStatusText = require('./utils/httpStatusText')
app.use(express.json());
const mongosse = require('mongoose')
const url = process.env.MONGO_URL

mongosse.connect(url)
  .then(() => {
    console.log("mongodb connect success !");
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB:", err);
  });

const coursesRouter = require('./routes/courses.routes')
const usersRouter = require('./routes/users.routes')

app.use(cors())
app.use('/uploads' , express.static(path.join(__dirname , 'uploads')))
app.use('/api/courses' , coursesRouter)
app.use('/api/users' , usersRouter)


//global middleware for not found router
app.all('*', (req, res, next) => {
  return res.status(404).json({ status: httpStatusText.ERROR, message: "This route is not available" });
});

//global error handler
app.use((error , req , res , next)=>{
  return res.status(error.statusCode || 500).json({status : error.statusText || httpStatusText.ERROR , message : error.message, data : null , code : error.statusCode})

})

app.listen(10002, () => {

  console.log("Hello World!");
  
});
