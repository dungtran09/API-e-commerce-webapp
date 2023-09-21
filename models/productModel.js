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
      type: [
        {
          summary: String,
          details: String,
        },
      ],
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "ProductCategory",
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
