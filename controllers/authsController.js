const User = require("../models/userModel");
const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const fs = require("fs");
const sendEmail = require("../utils/Email");
const crypto = require("crypto");

// CREATE TOKEN
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SCRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// SEND USER ON DB
const sendToken = (res, user, token, statusCode) => {
  const cookieOptions = {
    expries: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPRIES * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

// SIGN USER
exports.signUp = asyncErrorHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone } = req.body;

  if (!firstName || lastName || email || phone) {
    return next(new CustomError("Please provide all the fields.", 404));
  }

  const newUser = await User.create(req.body);

  const token = createToken(newUser._id);

  sendToken(res, newUser, token, 201);
});

// LOGIN USER
exports.logIn = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError("Please provide email and password.", 404));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new CustomError("Password is not correct.", 401));
  }

  const token = createToken(user.id);

  // save token in to file TOKEN.txt (USING FOR test_api)
  // try {
  //   fs.writeFileSync(`${__dirname}/../test_api/config/TOKEN.txt`, token);
  //   console.log("Write Reset Token Successfully!");
  // } catch (error) {
  //   console.log(error.message);
  // }

  sendToken(res, user, token, 200);
});

// PROTECTING DATA
exports.protect = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authorization;
  let token;

  // 1. check token and get
  if (testToken || testToken?.startsWith("bearer")) {
    token = testToken.split(" ")[1];
  }

  if (!token) {
    return next(new CustomError("You are not logged to access.", 401));
  }

  // 2. validate token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SCRET,
  );

  const user = await User.findById({ _id: decodedToken.id });

  // 3. check user exist or not
  if (!user) {
    return next(
      new CustomError("User belonging to this token no longer exist.", 401),
    );
  }

  // 4. check any info changed recently
  const isChanged = user.isChanged(decodedToken.iat);
  if (isChanged) {
    return next(
      new CustomError(
        "There are some changed recently. Please login again.",
        401,
      ),
    );
  }

  req.user = user;

  next();
});

// RESTRICT
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError(
          "You do not have permision to perform this acction.",
          403,
        ),
      );
    }
    next();
  };
};

// FORFOT PASSWORD
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //1. Get user based on the given email
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return next(new CustomError("There is no user with this email.", 404));
  }
  //2. Create a random token
  const resetToken = user.createPasswordResetToken();

  // save token <for test_api>
  try {
    fs.writeFileSync(
      `${__dirname}/../test_api/config/RESET_PASSWORD_TOKEN.txt`,
      resetToken,
    );
    console.log("Write Password Reset Token Successfully!");
  } catch (error) {
    console.log(error.message);
  }

  await user.save({ validateBeforeSave: false });

  //3. Send email back to user
  const resetUrl = `${req.protocol}://${req.get(
    "host",
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `We are recived a reset password request. Click link below to reset your password.\nLINK: ${resetUrl}\n\nThis link reset will be expried in 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset password",
      message: message,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset link sended to the email.",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new CustomError(
        "There was an error sending password reset email. Try gain later!",
        500,
      ),
    );
  }
});

// RESET PASSWORD
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  // Included 4 step.
  // 1. Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  //2. Check if token has been expires or not. if not then and set password else throw error
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Token invalid or has expired.", 400));
  }

  //3. Update changedPassword for user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save({ validateBeforeSave: true });

  const loginToken = createToken(user._id);

  //4. Login user and sen JWT
  sendToken(res, loginToken, user, 200);
});

// UPDATE PASSWORD
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  // 1. check user
  const user = await User.findById({ _id: req.user.id }).select("+password");

  if (!user) {
    return next(new CustomError("User is not found", 404));
  }

  // 2. check if current password correct
  if (
    !(await user.isPasswordCorrect(req.body.currentPassword, user.password))
  ) {
    return next(new CustomError("Current password invalid.", 401));
  }

  // 3. if (2) true => update passaword
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save({ validateBeforeSave: true });

  // 4. login after password changed
  const logInToken = createToken(user._id);
  sendToken(res, logInToken, user, 200);
});
