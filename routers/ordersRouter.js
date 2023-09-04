const express = require("express");
const authsController = require("../controllers/authsController");
const ordersController = require("../controllers/ordersController");

const router = express();

router
  .route("/")
  .post(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    ordersController.createOrder,
  );
router
  .route("/status/:id")
  .patch(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    ordersController.updateStatusOrder,
  );
module.exports = router;
