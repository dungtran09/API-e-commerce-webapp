const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Brand must be have a name."],
      index: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
