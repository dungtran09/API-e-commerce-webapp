const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: [true, "Quantity is required."],
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    color: {
      type: String,
      required: [true, "Color is required."],
    },
  },
  { timestamps: true },
);

const OrderItem = mongoose.model("order_item", orderItemSchema);
module.exports = OrderItem;
