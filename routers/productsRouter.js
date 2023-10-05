const express = require("express");
const productsController = require("../controllers/productsController");
const authsController = require("../controllers/authsController");
const uploadCloud = require("../config/cloudinary.config");

const router = express.Router();

// PRODUCTS STATS
// router.route("/product-stats").get(productsController.getProductsStats);

router.route("/colors").get(productsController.getColorsProduct);
router.route("/count").get(productsController.countProductsByCategory);
router.route("/ratings/:id").patch(
  authsController.protect,
  // authsController.restrictTo("Admin", "Guide"),
  productsController.ratingsProduct,
);

router
  .route("/")
  .get(productsController.getAllProducts)
  .get(productsController.getProductsByCategoryId)
  .post(
    // authsController.protect,
    // authsController.restrictTo("Admin", "Guide"),
    productsController.createProduct,
  );
router.route("/search").get(productsController.getProductsByStringSearchFields);

router
  .route("/:id")
  .get(
    // authsController.protect,
    // authsController.restrictTo("Admin", "Guide"),
    productsController.getProduct,
  )
  .patch(
    // authsController.protect,
    // authsController.restrictTo("Admin", "Guide"),
    productsController.updateProduct,
  )
  .delete(
    // authsController.protect,
    // authsController.restrictTo("Admin", "Guide"),
    productsController.deleteProduct,
  );

router.route("/uploadImagesProduct/:id").put(
  // authsController.protect,
  // authsController.restrictTo("Admin", "Guide"),
  // uploadCloud.array("images", 10),
  productsController.uploadImagesProduct,
);

module.exports = router;
