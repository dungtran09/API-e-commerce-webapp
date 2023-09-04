const express = require("express");
const blogsController = require("../controllers/blogsController");
const authsController = require("../controllers/authsController");
const uploadCloud = require("../config/cloudinary.config");

const router = express();

router
  .route("/")
  .get(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide", "Creator"),
    blogsController.getAllBlogs,
  )
  .post(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide", "Creator"),
    blogsController.createBlog,
  );

router
  .route("/:id")
  .get(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide", "Creator"),
    blogsController.getBlog,
  )
  .patch(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide", "Creator"),
    blogsController.updateBlog,
  )
  .delete(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide", "Creator"),
    blogsController.deleteBlog,
  );

router
  .route("/like/:id")
  .patch(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide", "Creator"),
    blogsController.likeBlog,
  );

router
  .route("/dislike/:id")
  .patch(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide", "Creator"),
    blogsController.dislikeBlog,
  );

router
  .route("/uploadImageBlog/:id")
  .put(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide", "Creator"),
    uploadCloud.single("image"),
    blogsController.uploadImageBlog,
  );

module.exports = router;
