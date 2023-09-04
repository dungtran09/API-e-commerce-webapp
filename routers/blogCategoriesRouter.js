const express = require("express");
const blogCategoriesController = require("../controllers/blogCategoriesController");
const authsController = require("../controllers/authsController");

const router = express.Router();

router
  .route("/")
  .post(
    authsController.protect,
    authsController.restrictTo("Admin"),
    blogCategoriesController.createBlogCategory,
  )
  .get(
    authsController.protect,
    authsController.restrictTo("Admin"),
    blogCategoriesController.getAllBlogCategories,
  );

router
  .route("/:id")
  .get(
    authsController.protect,
    authsController.restrictTo("Admin"),
    blogCategoriesController.getBlogCategory,
  )
  .patch(
    authsController.protect,
    authsController.restrictTo("Admin"),
    blogCategoriesController.updateBlogCategory,
  )
  .delete(
    authsController.protect,
    authsController.restrictTo("Admin"),
    blogCategoriesController.deleteBlogCategory,
  );

module.exports = router;
