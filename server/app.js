const express = require("express")
const cors = require("cors")
const CustomError = require("./Utils/customError")
const globalErrorFeature = require("./Controllers/errorController")
const authRoute = require("./Routes/authRoute")
const blogRoute = require("./Routes/blogRoute")

const app = express()
app.use(express.json())
app.use(cors())

app.use("/auth/",authRoute)
app.use("/",blogRoute)

app.all("*",function(req,res,next){
  const err = new CustomError(`Invalid endpoint ${req.originalUrl}.`,400)
  return next(err)
})

app.use(globalErrorFeature)

module.exports = app