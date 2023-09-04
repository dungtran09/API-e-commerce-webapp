const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
      },
    ],
    status: {
      type: String,
      default: "Proccessing",
      emun: ["Cancelled", "Proccessing", "Succeed"],
    },
    total: {},
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
