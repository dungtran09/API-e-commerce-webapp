const mongoose = require("mongoose");

const blogCategorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog Category must be a name."],
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

const BlogCategory = mongoose.model("blog-Category", blogCategorySchema);

module.exports = BlogCategory;
