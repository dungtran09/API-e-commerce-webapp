const express = require("express");
const authsController = require("../controllers/authsController");
const usersController = require("../controllers/usersController");

const router = express.Router();

router.route("/signup").post(authsController.signUp);
router.route("/login").post(authsController.logIn);

router.route("/forgotPassword").post(authsController.forgotPassword);
router.route("/resetPassword/:token").patch(authsController.resetPassword);

router
  .route("/updatePassword")
  .patch(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    authsController.updatePassword,
  );

router
  .route("/updateUser")
  .patch(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    usersController.updateUser,
  );

router
  .route("/updateAddressUser")
  .patch(authsController.protect, usersController.updateUserAddress);

router
  .route("/updateCart")
  .patch(authsController.protect, usersController.updateCart);

router
  .route("/deleteUser")
  .delete(
    authsController.protect,
    authsController.restrictTo("Admin", "Guide"),
    usersController.deleteUser,
  );

router.route("/").get(authsController.protect, usersController.getAllUsers);
router.route("/:id").get(authsController.protect, usersController.getUser);

module.exports = router;
