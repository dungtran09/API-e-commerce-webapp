const { query } = require("express");
const Product = require("../models/productModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const FeaturesAPI = require("../utils/FeaturesAPI");
const slugify = require("slugify");
const ProductCategory = require("../models/productCategoryModel");
const Brand = require("../models/brandModel");
const User = require("../models/userModel");

// SEND RESPONSE
const send = (res, statusCode, products) => {
  res.status(statusCode).json({
    status: "success",
    results: products?.length,
    data: products,
  });
};

const getBrandName = async (id) => {
  const brand = await Brand.find({
    _id: { $in: id },
  });
  return brand[0]?.title;
};

const getCategoryName = async (id) => {
  const category = await ProductCategory.find({
    _id: { $in: id },
  });
  return category[0]?.title;
};

const getUserById = async (id) => {
  const user = await User.find({ _id: { $in: id } });

  return user;
};

// GET PRODUCTS
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
  const features = new FeaturesAPI(Product.find(), req?.query)
    .filter()
    .limit()
    .sort()
    .pagination();

  let products = await features.query;

  for (const product of products) {
    product.categoryName = await getCategoryName(product?.category);
    product.brandName = await getBrandName(product?.brand);
  }

  send(res, 200, products);
});

// GET PRODUCT BY CATEGORY ID
exports.getProductsByCategoryId = asyncErrorHandler(async (req, res, next) => {
  const features = new FeaturesAPI(
    Product.find({ category: { $in: _id } }),
    req.query,
  )
    .filter()
    .limit()
    .sort()
    .pagination();

  let products = await features.query;

  for (const product of products) {
    product.categoryName = await getCategoryName(product.category);
    product.brandName = await getBrandName(product.brand);
  }

  send(res, 200, products);
});

// GET PRODUCT BY STRING SEATCH FIELDS
exports.getProductsByStringSearchFields = asyncErrorHandler(
  async (req, res, next) => {
    const stringSearch = req?.query.search;
    const features = new FeaturesAPI(
      Product.find({ $text: { $search: stringSearch } }),
    ).pagination();

    const products = await features.query;

    for (const product of products) {
      product.categoryName = await getCategoryName(product?.category);
      product.brandName = await getBrandName(product?.brand);
    }

    if (!products) {
      new CustomError("No Results", 404);
    }

    send(res, 200, products);
  },
);

// GET PRODUCT
exports.getProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  product.categoryName = await getCategoryName(product.category);
  product.brandName = await getBrandName(product.brand);

  if (!product) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, product);
});

// CREATE PRODUCT
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  if (req.body.slug) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  send(res, 200, newProduct);
});

// UPDATE PRODUCT
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  if (req.body.slug) req.body.slug = slugify(req.body.title);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, product);
});

// DELETE PRODUCT
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 204, null);
});

// AGGREGARION PILELINE
exports.getProductsStats = asyncErrorHandler(async (req, res, next) => {
  res.status(500).json({
    status: "Error",
    message: "Not found.",
  });
});

// RATINGS PRODUCT
exports.ratingsProduct = asyncErrorHandler(async (req, res, next) => {
  const productToRating = await Product.findById(req.params.id);

  if (!productToRating) {
    return next(new CustomError("Product is not found.", 404));
  }

  const { _id } = req.user;
  const { star, text } = req.body;

  /* check id of use has been ratings product before or not
   *  -- if id user not rating product before => add new ratings
   *  -- if id user has been rating product berore => update rating products.
   * */
  let productRated = productToRating?.ratings?.find(
    (ele) => ele?.postedBy?.toString() === _id?.toString(),
  );

  if (productRated) {
    await Product.updateOne(
      {
        ratings: { $elemMatch: productRated },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.text": text },
      },
      { new: true },
    );
  } else {
    await Product.findByIdAndUpdate(
      productToRating?._id,
      {
        $push: { ratings: { star, text, postedBy: _id } },
      },
      { new: true },
    );
  }

  // re-Sum totaRatings fields
  productRated = await Product.findById(productToRating?._id);
  const countRatings = productRated.ratings.length;
  const totalRatings = productRated.ratings.reduce(
    (sum, ele) => sum + ele.star,
    0,
  );
  productRated.countRatings = countRatings;
  productRated.totalRatings =
    Math.round((totalRatings * 10) / countRatings) / 10;

  // Find user has ratings

  // for (const rating of productRated.ratings) {
  //   console.log(getUserById(rating._id));
  // }

  await productRated.save();

  send(res, 200, productRated);
});

// UPLOAD IMAGEs
exports.uploadImagesProduct = asyncErrorHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new CustomError("No files images", 404));
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $push: { $images: { $each: req.files.map((ele) => ele.path) } },
    },
    { new: true },
  );

  if (!product) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, product);
});

exports.getColorsProduct = asyncErrorHandler(async (req, res, next) => {
  const colors = await Product.aggregate([
    { $unwind: "$colors" },
    {
      $group: {
        _id: "$colors",
        frequency: { $sum: 1 },
      },
    },
    { $addFields: { color: "$_id" } },
    { $project: { _id: 0 } },
  ]);

  if (!colors) {
    return next(new CustomError("Colors products not found.", 404));
  }
  send(res, 200, colors);
});

exports.countProductsByCategory = asyncErrorHandler(async (req, res, next) => {
  const results = await Product.aggregate([
    // { $match: { category: ObjectId(req.query.category) } },
    {
      $group: { _id: "$category", totalItems: { $sum: 1 } },
    },
    {
      $addFields: { category: { $toString: "$_id" } },
    },
    {
      $project: { _id: 0 },
    },
  ]);

  if (req.query?.category) {
    for (const result of results) {
      if (req.query.category === result.category) {
        result.category = await getCategoryName(result.category);
        return send(res, 200, result);
      }
    }
  }

  for (const result of results) {
    result.category = await getCategoryName(result.category);
  }

  send(res, 200, results);
});
