const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const FeaturesAPI = require("../utils/FeaturesAPI");
const Brand = require("../models/brandModel");

// SEND RESPONSE
const send = (res, statusCode, brands) => {
  res.status(statusCode).json({
    status: "success",
    data: brands,
  });
};

// GET ALL BRAND
exports.getAllBrands = asyncErrorHandler(async (req, res, next) => {
  const features = new FeaturesAPI(Brand.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  const brands = await features.query;

  send(res, 200, brands);
});

// GET AN BRAND
exports.getBrand = asyncErrorHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, brand);
});

// CREATE BRAND
exports.createBrand = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body);

  const newBrand = await Brand.create(req.body);
  send(res, 200, newBrand);
});

// UPDATE BRAND
exports.updateBrand = asyncErrorHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!brand) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, brand);
});

// DELETE BRAND
exports.deleteBrand = asyncErrorHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);

  if (!brand) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }
  send(res, 204, null);
});
