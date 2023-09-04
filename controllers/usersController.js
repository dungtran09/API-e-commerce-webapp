const asyncErrorHandler = require("../utils/asyncErrorHandler");
const User = require("../models/userModel");
const CustomError = require("../utils/CustomError");
const FeaturesAPI = require("../utils/FeaturesAPI");

// FILTER BEFORE UPLOAD USER
const filterObj = (obj, ...aloweredFields) => {
  const newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (aloweredFields.includes(ele)) {
      newObj[ele] = obj[ele];
    }
  });
  return newObj;
};

// SEND RESPONSE
const send = (res, statusCode, users) => {
  res.status(statusCode).json({
    status: "success",
    data: users,
  });
};

// GET USERs
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const features = new FeaturesAPI(User.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  const users = await features.query;
  send(res, 200, users);
});

// GET USER
exports.getUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError(`User ID: ${req.params.id} not found.`, 404));
  }
  send(res, 200, user);
});

// UPDATE USER
exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    const link = "/api/v1/users/updatePassword";
    return next(
      new CustomError(
        `Can not update password. Click ${link} to update password.`,
        404,
      ),
    );
  }

  if (req.body.role) {
    return next(
      new CustomError(`You can not permission to update the role.`, 404),
    );
  }

  const filterBody = filterObj(req.body, "firstName", "lastName", "email");
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  if (!updateUser) {
    return next(new CustomError(`User ID: ${req.user.id} not found.`, 404));
  }
  send(res, 200, updateUser);
});

// DELETE USER
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  if (!user) {
    return next(
      new CustomError(`User ID: ${req.params.id} is not found.`, 404),
    );
  }
  send(res, 204, null);
});

// UPDATE ADDRESS USER
exports.updateUserAddress = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.address) {
    return next(new CustomError("Address is empty.", 404));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { address: req.body.address } },
    { new: true },
  );

  if (!user) {
    return next(new CustomError(`The ID: ${req.user._id} not found!`));
  }

  send(res, 200, user);
});

// UPDATE CARD
exports.updateCart = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.productId || !req.body.quantity || !req.body.color) {
    return next(new CustomError("Card info cannot be empty.", 404));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new CustomError(`The ID: ${req.user._id} is not found!`, 404));
  }

  // check if product has been exist in card or not
  // -- if product in the card: handler to updated > else < add new card
  const product = user.cart?.find(
    (el) => el.productId.toString() == req.body.productId,
  );

  let userUpdated;
  if (product) {
    if (
      product.quantity != req.body.quantity &&
      product.color != req.body.color
    ) {
      userUpdated = await User.updateMany(
        { cart: { $elemMatch: product } },
        {
          $set: {
            "cart.$.quantity": req.body.quantity,
            "cart.$.color": req.body.color,
          },
        },
      );
    } else if (product.quantity != req.body.quantity) {
      userUpdated = await User.updateOne(
        { cart: { $elemMatch: product } },
        {
          $set: {
            "cart.$.quantity": req.body.quantity,
          },
        },
      );
    } else {
      userUpdated = await User.updateOne(
        { cart: { $elemMatch: product } },
        {
          $set: {
            "cart.$.color": req.body.color,
          },
        },
      );
    }
  } else {
    userUpdated = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          cart: {
            productId: req.body.productId,
            quantity: req.body.quantity,
            color: req.body.color,
          },
        },
      },
      { new: true },
    );
  }
  send(res, 200, userUpdated);
});
