const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
  title:{
    type:String,
    required:[true,"Blog title is required"]
  },
  description:{
    type:String,
    required:[true,"Description title is required"]
  },
  image:{
    data:Buffer,
    type:String,
    required:[true,"image field is required"],
    default:"https://res.cloudinary.com/db0f83m76/image/upload/v1724512947/default-blog_t4pr7b.jpg"
  },
  tags:{
    type:Array,
    required:[true,"Tags are required.."]
  },
  timeTakeToRead:{
    type:String,
    required:[true,"Time Taken field is required"]
  }
},{timestamps:true})

const Blog = mongoose.model("Blog",blogSchema)

module.exports = Blog