const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon must be have a name."],
      unique: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: [true, "Discount is required."],
    },
    expiry: {
      type: Date,
      required: [true, "Expiry is required."],
    },
  },
  { timestamps: true },
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
