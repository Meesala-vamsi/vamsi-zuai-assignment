const express = require("express")
const authController = require("../Controllers/authController")
const blogController = require("../Controllers/blogController")
const upload = require("../Storage/Storage")
const router = express.Router()

router.route("/posts")
      .post(authController.contentPermission,upload.single("image"), blogController.createBlog)
      .get(authController.contentPermission,blogController.getAllBlogs)
      
router.route("/posts/:id")
      .patch(authController.contentPermission,upload.single("image"),blogController.updateBlog)
      .delete(authController.contentPermission,upload.single("image"),blogController.deleteBlog)
      .get(authController.contentPermission,blogController.getBlogById)
router.route("/search")
      .get(authController.contentPermission,blogController.searchByTitle)

module.exports = router