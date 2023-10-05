const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
    status: {
      type: String,
      default: "Pending",
      emun: [
        "Pending",
        "Processing",
        "Shipping",
        "Canceled",
        "Paid",
        "Refunded",
      ],
    },
    firstName: {
      type: String,
      required: [true, "First name is required."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
    },
    shipping_address: {
      type: String,
      required: [true, "Address is required."],
    },
    email: {
      type: String,
      required: [true, "Email is requied."],
    },
    phone: {
      type: String,
      required: [true, "Phone number is requied."],
    },
    shipping_fee: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    dateOrdered: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
