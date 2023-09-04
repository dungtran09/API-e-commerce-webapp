const express = require("express");
const brandsController = require("../controllers/brandsController");
const authsController = require("../controllers/authsController");

const router = express.Router();

router
  .route("/")
  .post(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    brandsController.createBrand,
  )
  .get(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    brandsController.getAllBrands,
  );

router
  .route("/:id")
  .get(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    brandsController.getBrand,
  )
  .patch(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    brandsController.updateBrand,
  )
  .delete(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    brandsController.deleteBrand,
  );

module.exports = router;
