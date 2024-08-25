
const User = require("../Models/userModel");
const { asyncErrorHandler } = require("../Utils/asyncHandler");
const CustomError = require("../Utils/customError");
const jwt = require("jsonwebtoken")

exports.contentPermission=asyncErrorHandler(async(req,res,next)=>{
  const authHead = req.headers.authorization
    if(authHead===undefined){
        const error = new CustomError("Invalid jwt token",401)
        next(error)
    }
    const token = authHead.split(" ")[1]

    if(token === undefined){
        const error = new CustomError("Invalid jwt token",401)
        next(error)
    }else{
        jwt.verify(token,"vamsisony",async(error,data)=>{
            if(error){
                const error = new CustomError("Invalid Jwt token",401)
                next(error)
            }else{
                const user = await User.findById(data.id)
                    req.user = user
                    next()
            }
        })
    }
})

const generateJwt=(payload,res)=>{
  const createJwtToken = jwt.sign(payload,"vamsisony")
  return createJwtToken
}
exports.register = asyncErrorHandler(async(req,res,next)=>{ 
  const user = await User.create(req.body)

  res.status(201).json({
    status:"success",
    message:"Account created successfully."
  })
})

exports.login=asyncErrorHandler(async(req,res,next)=>{
  const user = await User.findOne({email:req.body.email}).select("+password")

  if(!user){
    const error = new CustomError("User not found with the given credentials",404)
    return next(error)
  }

  if(!(await user.comparePasswordsInDb(req.body.password))){
    const error = new CustomError("Invalid Password",401)
    return next(error)
  }

  const token = generateJwt({id:user._id})

  res.status(200).json({
    status:"success",
    message:"Logged in successfully",
    token,
    data:{
      id:user._id,
      username:user.username,
      email:user.email
    }
  })
  
})