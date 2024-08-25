const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")


const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true,"Username field is required"]
  },
  email:{
    type:String,
    validate:[
      validator.isEmail,"Invalid Email"
    ],
    required:[true,"Email field is required"],
    unique:true
  },
  password:{
    type:String,
    required:[true,"Password field is required"],
    select:false
  }
},{timestamps:true})


userSchema.pre("save",async function(next){
  if(!this.isModified("password"))return next()
    const hashedPassword = await bcrypt.hash(this.password,10)
  this.password = hashedPassword
})

userSchema.methods.comparePasswordsInDb= async function(passwordFromUser){
  const checkPassword = await bcrypt.compare(passwordFromUser,this.password)
  return checkPassword
}

const User = mongoose.model("User",userSchema)

module.exports = User