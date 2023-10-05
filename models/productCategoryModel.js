const mongoose = require("mongoose");

const productCategorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title can not be empty."],
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, "Slug can not be empty."],
      unique: true,
    },
    brands: [{ type: mongoose.Schema.Types.ObjectId, ref: "Brand" }],
    image: {
      type: String,
      required: [true, "Image can not be empty."],
    },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true },
);

const ProductCategory = mongoose.model(
  "product_category",
  productCategorySchema,
);

module.exports = ProductCategory;
