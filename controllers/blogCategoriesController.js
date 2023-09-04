const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const BlogCategory = require("../models/blogCategoryModel");
const FeaturesAPI = require("../utils/FeaturesAPI");

const send = (res, statusCode, blogCategory) => {
  res.status(statusCode).json({
    status: "success",
    data: blogCategory,
  });
};

// GET ALL BLOG CATEGORIES
exports.getAllBlogCategories = asyncErrorHandler(async (req, res, next) => {
  const features = new FeaturesAPI(BlogCategory.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  const blogCategories = await features.query;

  send(res, 200, blogCategories);
});

// GET AN BLOG CATEGORY
exports.getBlogCategory = asyncErrorHandler(async (req, res, next) => {
  const blogCategory = await BlogCategory.findById(req.params.id);

  if (!blogCategory) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, blogCategory);
});

// CREATE BLOG CATEGORY
exports.createBlogCategory = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body);

  const newBlogCategory = await BlogCategory.create(req.body);
  send(res, 200, newBlogCategory);
});

// UPDATE BLOG CATEGORY
exports.updateBlogCategory = asyncErrorHandler(async (req, res, next) => {
  const blogCategory = await BlogCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!blogCategory) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, blogCategory);
});

// DELETE BLOG CATEGORY
exports.deleteBlogCategory = asyncErrorHandler(async (req, res, next) => {
  const blogCategory = await BlogCategory.findByIdAndDelete(req.params.id);

  if (!blogCategory) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 204, null);
});
