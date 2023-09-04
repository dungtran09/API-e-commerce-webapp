const Coupon = require("../models/couponModel");
const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const FeaturesAPI = require("../utils/FeaturesAPI");

// SEND RESPONSE
const send = (res, statusCode, coupon) => {
  res.status(statusCode).json({
    status: "success",
    data: coupon,
  });
};

// GET ALL COUPON
exports.getAllCoupons = asyncErrorHandler(async (req, res, next) => {
  const features = new FeaturesAPI(Coupon.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  const coupons = await features.query;

  send(res, 200, coupons);
});

// GET AN COUPON
exports.getCoupon = asyncErrorHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, coupon);
});

// CREATE COUPON
exports.createCoupon = asyncErrorHandler(async (req, res, next) => {
  let { name, discount, expiry } = req.body;
  expiry = Date.now() + +expiry * 24 * 60 * 60 * 1000;

  const newCoupon = await Coupon.create({ name, discount, expiry });
  send(res, 200, newCoupon);
});

// UPDATE COUPON
exports.updateCoupon = asyncErrorHandler(async (req, res, next) => {
  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, coupon);
});

// DELETE COUPON
exports.deleteCoupon = asyncErrorHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  if (!coupon) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }
  send(res, 204, null);
});
