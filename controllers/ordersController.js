const Order = require("../models/orderModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const FeaturesAPI = require("../utils/FeaturesAPI");
const User = require("../models/userModel");
const Coupon = require("../models/couponModel");
const OrderItem = require("../models/orderItemModel");
const Product = require("../models/productModel");
const Brand = require("../models/brandModel");

// SEND RESPONSE
const send = (res, statusCode, orders) => {
  res.status(statusCode).json({
    status: "success",
    data: orders,
  });
};

// CREATE ORDER
exports.createOrder = asyncErrorHandler(async (req, res, next) => {
  // const user = await User.findById(user_id);
  //
  // if (!user) {
  //   return next(new CustomError(`The ID: ${user_id} not found.`, 404));
  // }

  const {
    orderItems,
    firstName,
    lastName,
    shipping_address,
    email,
    phone,
    coupon,
    user_id,
    shipping_fee,
  } = req.body;

  const orderItemsIds = Promise.all(
    orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        color: orderItem.color,
        product_id: orderItem.product_id,
      });

      newOrderItem = await newOrderItem.save();
      if (!newOrderItem) {
        return next(
          new CustomError(
            "Order Item can't not created. Please try again.",
            404,
          ),
        );
      }
      return newOrderItem._id;
    }),
  );

  const orderItemsIdsResolved = await orderItemsIds;
  // calc total price
  const totalPrice = Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate({
        path: "product_id",
        model: Product,
        select: "price",
      });
      const totalPrice = orderItem.product_id.price * orderItem.quantity;
      return totalPrice;
    }),
  );
  const totalPriceResolved = await totalPrice;

  // totalPriceResolved return an array total price for each order item. using reduce () to calc totalPrice
  let newTotalPrice = totalPriceResolved.reduce(
    (prevPrice, currPrice) => prevPrice + currPrice,
    0,
  );

  console.log(newTotalPrice);

  if (shipping_fee) {
    newTotalPrice = newTotalPrice + shipping_fee;
  }

  const order = {
    orderItems: orderItemsIdsResolved,
    firstName: firstName,
    lastName: lastName,
    shipping_address: shipping_address,
    email: email,
    phone: phone,
    coupon: coupon,
    totalPrice: newTotalPrice,
    user_id: user_id,
    shipping_fee: shipping_fee,
  };

  // check if product have coupon or not.
  if (coupon) {
    const coupon = await Coupon.findById(req.body.coupon);
    if (coupon) {
      total = Math.round((total * (1 - +coupon.discount / 100)) / 1000) * 1000;
      order.totalPrice = total;
      order.coupon = coupon;
    }
  }

  const newOrder = await Order.create(order);

  if (!newOrder) {
    return next(
      new CustomError("Order can't be created. Please try again", 404),
    );
  }

  send(res, 200, newOrder);
});

// GET ALL USER ORDERs
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const features = new FeaturesAPI(
    Order.find().populate("user_id", { firstName: 1, lastName: 1, email: 1 }),
    req.query,
  )
    .filter()
    .limit()
    .sort()
    .pagination();

  const orders = await features.query;
  send(res, 200, orders);
});

// GET USER ORDER
exports.getOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user_id", {
      firstName: 1,
      lastName: 1,
      email: 1,
    })
    .populate({
      path: "orderItems",
      model: OrderItem,
      populate: {
        path: "product_id",
        model: Product,
      },
    });

  if (!order) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 200, order);
});

// UPDATE STATUS ORDER
exports.updateStatusOrder = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.status) {
    return next(new CustomError("Status order cannot be empty.", 404));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );

  if (!order) {
    return next(new CustomError(`The ID: ${req.params.id} not found.`, 404));
  }

  send(res, 201, order);
});

exports.getTotalSales = asyncErrorHandler(async (req, res, next) => {
  const totalSales = await Order.aggregate([
    {
      $group: { _id: null, totalSales: { $sum: "$totalPrice" } },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  if (!totalSales) {
    return next(
      new CustomError(
        "The order sales cannot be generated, Try again later!",
        404,
      ),
    );
  }
  send(res, 200, totalSales);
});

exports.countOrders = asyncErrorHandler(async (req, res, next) => {
  const countOrders = await Order.where({}).count();
  if (!countOrders) {
    return next(
      new CustomError("Cannot be count orders, Try again later!", 404),
    );
  }
  send(res, 200, countOrders);
});
