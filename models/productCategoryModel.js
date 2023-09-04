const mongoose = require("mongoose");

const productCategorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product category must be a name."],
      unique: true,
      index: true,
    },
    brand: {
      type: Array,
      required: [true, "Brand can not be empty."],
    },
  },
  { timestamps: true },
);

const ProductCategory = mongoose.model(
  "product-Category",
  productCategorySchema,
);

module.exports = ProductCategory;
