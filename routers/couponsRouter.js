const express = require("express");
const authsController = require("../controllers/authsController");
const couponsController = require("../controllers/couponsController");

const router = express();

router
  .route("/")
  .post(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    couponsController.createCoupon,
  )
  .get(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    couponsController.getAllCoupons,
  );

router
  .route("/:id")
  .get(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    couponsController.getCoupon,
  )
  .patch(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    couponsController.updateCoupon,
  )
  .delete(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    couponsController.deleteCoupon,
  );

module.exports = router;
