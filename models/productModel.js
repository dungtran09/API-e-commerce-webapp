const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product name can not be empty."],
      index: true,
      text: true,
    },
    slug: {
      type: String,
      required: [true, "Slug can not be empty."],
      trim: true,
      lowercase: true,
    },
    thumb: {
      type: String,
      trim: true,
      required: [true, "Thumb can not be empty."],
    },
    price: {
      type: Number,
      required: [true, "Price can not be empty."],
    },
    description: {
      type: Object,
      index: true,
      text: true,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
      index: true,
      text: true,
    },
    brandName: {
      type: String,
      text: true,
      index: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "ProductCategory",
    },
    categoryName: {
      type: String,
      text: true,
      index: true,
    },
    configuration: [],
    variants: {
      type: [
        {
          colors: [
            {
              name: String,
              image: String,
            },
          ],
          storage_capacity: [String],
        },
      ],
    },
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
        text: { type: String },
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
