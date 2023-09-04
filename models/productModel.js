const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product name can not be empty."],
    },
    slug: {
      type: String,
      required: [true, "Slug can not be empty."],
      trim: true,
      lowercase: true,
    },
    images: [String],
    price: {
      type: Number,
      required: [true, "Price can not be empty."],
    },
    description: {
      type: Array,
      required: [true, "Description can not be empty."],
    },
    brand: {
      type: String,
      required: [true, "Branh can not be empty."],
    },
    category: {
      type: String,
      required: [true, "Category can not be empty."],
    },
    colors: [String],
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        star: { type: Number },
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
        comment: { type: String },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Products", productSchema);

module.exports = Product;
