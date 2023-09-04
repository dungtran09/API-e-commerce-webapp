const express = require("express");
const productCategoriesController = require("../controllers/productCategoriesController");
const authsController = require("../controllers/authsController");

const router = express.Router();

router
  .route("/")
  .post(
    authsController.protect,
    authsController.restrictTo("Admin"),
    productCategoriesController.createProductCategory,
  )
  .get(
    authsController.protect,
    authsController.restrictTo("Admin"),
    productCategoriesController.getAllProductCategories,
  );

router
  .route("/:id")
  .get(
    authsController.protect,
    authsController.restrictTo("Admin"),
    productCategoriesController.getProductCategory,
  )
  .patch(
    authsController.protect,
    authsController.restrictTo("Admin"),
    productCategoriesController.updateProductCategory,
  )
  .delete(
    authsController.protect,
    authsController.restrictTo("Admin"),
    productCategoriesController.deleteProductCategory,
  );

module.exports = router;
