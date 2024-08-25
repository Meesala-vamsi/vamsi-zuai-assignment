const Blog = require("../Models/blogModel");
const { asyncErrorHandler } = require("../Utils/asyncHandler");
const fs = require("fs");
const CustomError = require("../Utils/customError");
const cloudinary = require('cloudinary').v2;


exports.createBlog=asyncErrorHandler(async(req,res,next)=>{
  await Blog.create({
    title:req.body.title,
    description:req.body.description,
    image:req.file.path,
    tags:Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags],
    timeTakeToRead:req.body.timeTakeToRead
  })

  res.status(201).json({
    status:"success",
    message:"Blog created successfully.",
  })
})

exports.updateBlog = asyncErrorHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    const error = new CustomError("Blog not found", 404)
    return next(error);
  }

  
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      //deleting the existing image
      if (blog.image) {
        const imagePublicId = blog.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(imagePublicId);
      }
      req.body.image = result.secure_url;
    } catch (error) {
      return next(new CustomError("Failed to upload image to Cloudinary", 500));
    }
  }

  //updating with new details

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Blog updated successfully",
    data: updatedBlog,
  });
});

exports.deleteBlog = asyncErrorHandler(async(req,res)=>{
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    const error = new CustomError("Blog not found", 404)
    return next(error);
  }

  const imagePublicId = blog.image.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(imagePublicId);

  await Blog.findByIdAndDelete(req.params.id,{runValidators:true,new:true})

  res.status(200).json({
    status:"success",
    message:"Blog deleted successfully"
  })
})

exports.getAllBlogs=asyncErrorHandler(async(req,res,next)=>{
  const blogs = await Blog.find({})

  res.status(200).json({
    status:"success",
    count:blogs.length,
    data:{
      blogs
    }
  })
})

exports.searchByTitle=asyncErrorHandler(async(req,res,next)=>{
  const {search} = req.query
  let blog = null
  if (search) {
    blog = await Blog.find({
      title: {
        $regex: new RegExp(search, "i")
      }
    });
  }else{
    blog = await Blog.find({})
  }
  if (blog.length === 0) {
    return next(new CustomError("No BLogs found with that title", 404));
  }

  res.status(200).json({
    status: "success",
    results: blog.length,
    data: {
      blog
    }
  });
})

exports.getBlogById = asyncErrorHandler(async(req,res,next)=>{
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    const error = new CustomError("Blog not found", 404)
    return next(error);
  }

  res.status(200).json({
    status:"success",
    data:{
      blog
    }
  })
})
