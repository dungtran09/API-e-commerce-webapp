const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const Blog = require("../models/blogModel");
const FeaturesAPI = require("../utils/FeaturesAPI");

// SEND RESPONSE
const send = (res, statusCode, blog) => {
  res.status(statusCode).json({
    status: "success",
    blog,
  });
};

// GET ALL BLOG
exports.getAllBlogs = asyncErrorHandler(async (req, res, next) => {
  const features = new FeaturesAPI(Blog.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  const blogs = await features.query;

  send(res, 200, blogs);
});

// GET AN BLOG
exports.getBlog = asyncErrorHandler(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { numberOfViews: 1 } },
    { new: true },
  )
    .populate("likes", "firstName lastName")
    .populate("dislikes", "firstName lastName");

  if (!blog) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, blog);
});

// CREATE BLOG
exports.createBlog = asyncErrorHandler(async (req, res, next) => {
  const newBlog = await Blog.create(req.body);
  send(res, 200, newBlog);
});

// UPDATE BLOG
exports.updateBlog = asyncErrorHandler(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, blog);
});

// DELETE Blog
exports.deleteBlog = asyncErrorHandler(async (req, res, next) => {
  const blog = await blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 204, null);
});

// LIKE BLOG
exports.likeBlog = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;

  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(
      new CustomError(`The ID: ${req.params.id} of blog not found.`, 404),
    );
  }

  const isDisliked = blog?.dislikes?.find((el) => el.toString() == _id);

  if (isDisliked) {
    const updateBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $pull: { dislikes: _id } },
      { new: true },
    );
    send(res, 200, updateBlog);
  }

  const isLiked = blog?.likes?.find((el) => el.toString() == _id);

  if (isLiked) {
    const updateBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: _id } },
      { new: true },
    );
    send(res, 200, updateBlog);
  } else {
    const updateBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likes: _id },
      },
      { new: true },
    );
    send(res, 200, updateBlog);
  }
});

// DISLIKE BLOCK
exports.dislikeBlog = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(
      new CustomError(`The ID: ${req.params.id} of blog not found.`, 404),
    );
  }

  const isLiked = blog.likes.find((el) => el.toString() == _id);

  if (isLiked) {
    const updateBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: _id } },
      { new: true },
    );
    send(res, 200, updateBlog);
  }

  const isDisliked = blog.dislikes.find((el) => el.toString() == _id);

  if (isDisliked) {
    const updateBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $pull: { dislikes: _id } },
      { new: true },
    );
    send(res, 200, updateBlog);
  } else {
    const updateBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $push: { dislikes: _id },
      },
      { new: true },
    );
    send(res, 200, updateBlog);
  }
});

// UPLOAD IMAGE BOG
exports.uploadImageBlog = asyncErrorHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new CustomError("File image is not found.", 404));
  }

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { image: req.file.path },
    {
      new: true,
    },
  );

  if (!blog) {
    return next(new CustomError(`The ID: ${req.params.id} not found!`, 404));
  }

  send(res, 200, blog);
});
