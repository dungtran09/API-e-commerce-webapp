const Order = require("../models/orderModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const FeaturesAPI = require("../utils/FeaturesAPI");
const User = require("../models/userModel");
const Coupon = require("../models/couponModel");

// SEND RESPONSE
const send = (res, statusCode, orders) => {
  res.status(statusCode).json({
    status: "success",
    data: orders,
  });
};

// CREATE ORDER
exports.createOrder = asyncErrorHandler(async (req, res, next) => {
  const userCart = await User.findById(req.user._id)
    .select("cart")
    .populate("cart.product", "title, price");

  if (!userCart) {
    return next(new CustomError(`The ID: ${req.user._id} not found.`, 404));
  }

  const products = userCart.cart.map((ele) => ({
    product: ele.product._id,
    count: ele.quantity,
    color: ele.color,
  }));

  // total products
  let total = userCart.cart.reduce(
    (sum, ele) => ele.product.price * ele.quantity + sum,
    0,
  );

  const newOrder = { products, total, orderBy: req.user_id };

  // check if product have coupon or not.
  if (req.body.coupon) {
    const coupon = await Coupon.findById(req.body.coupon);
    if (coupon) {
      total = Math.round((total * (1 - +coupon.discount / 100)) / 1000) * 1000;
      newOrder.total = total;
      newOrder.coupon = coupon;
    }
  }

  newOrder = await Order.create(newOrder);

  send(res, 200, newOrder);
});

// GET ALL USER ORDERs
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const features = new FeaturesAPI(Order.find(), req.query)
    .filter()
    .limit()
    .sort()
    .pagination();

  const orders = await features.query;
  send(res, 200, orders);
});

// GET USER ORDER
exports.getOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.user._id);

  if (!order) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, order);
});

// UPDATE STATUS ORDER
exports.updateStatusOrder = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.status) {
    return next(new CustomError("Status order cannot be empty.", 404));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body },
    { new: true },
  );

  if (!order) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 201, order);
});
