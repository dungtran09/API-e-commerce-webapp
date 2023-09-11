const ProductCategory = require("../models/productCategoryModel");
const FeaturesAPI = require("../utils/FeaturesAPI");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const slugify = require("slugify");

// SEND RESPONSE
const send = (res, statusCode, productCategory) => {
  res.status(statusCode).json({
    status: "success",
    data: productCategory,
  });
};

// GET ALL PRODUCT CATEGORIES
exports.getAllProductCategories = asyncErrorHandler(async (req, res, next) => {
  const features = new FeaturesAPI(ProductCategory.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  const productCategories = await features.query;

  send(res, 200, productCategories);
});

// GET AN PRODUCT CATEGORY
exports.getProductCategory = asyncErrorHandler(async (req, res, next) => {
  const productCategory = await ProductCategory.findById(req.params.id);

  if (!productCategory) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, productCategory);
});

// CREATE PRODUCT CATEGORY
exports.createProductCategory = asyncErrorHandler(async (req, res, next) => {
  if (req.body.slug) req.body.slug = slugify(req.body.title);
  const newProductCategory = await ProductCategory.create(req.body);
  send(res, 200, newProductCategory);
});

// UPDATE PRODUCT CATEGORY
exports.updateProductCategory = asyncErrorHandler(async (req, res, next) => {
  if (req.body.slug) req.body.slug = slugify(req.body.title);
  const productCategory = await ProductCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!productCategory) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, productCategory);
});

// DELETE PRODUCT CATEGORY
exports.deleteProductCategory = asyncErrorHandler(async (req, res, next) => {
  const productCategory = await ProductCategory.findByIdAndDelete(
    req.params.id,
  );

  if (!productCategory) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 204, null);
});
