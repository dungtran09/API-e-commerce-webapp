const express = require("express");
const authsController = require("../controllers/authsController");
const ordersController = require("../controllers/ordersController");

const router = express();

router.route("/total-sales").get(
  // authsController.protect,
  // authsController.restrictTo("Admin", "Guide"),
  ordersController.getTotalSales,
);

router.route("/count-orders").get(
  // authsController.protect,
  // authsController.restrictTo("Admin", "Guide"),
  ordersController.countOrders,
);
router
  .route("/")
  .post(
    // authsController.protect,
    // authsController.restrictTo("Admin", "Guide"),
    ordersController.createOrder,
  )
  .get(ordersController.getAllOrders);

router
  .route("/:id")
  .patch(
    // authsController.protect,
    // authsController.restrictTo("Admin", "Guide"),
    ordersController.updateStatusOrder,
  )
  .get(ordersController.getOrder);

module.exports = router;
