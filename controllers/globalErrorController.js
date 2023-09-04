const CustomError = require("../utils/CustomError");

// send errors if node env is development
const errorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err.error,
    stack: err.stack,
  });
};

// send errors if node env is production
const errorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Server error.",
    });
  }
};

const handlerCastError = (err) => {
  let message;
  if (typeof err.name === "object") {
    message = `Invalid ${err.path}.`;
  } else {
    message = `Invalid ${err.path}: ${err.name}.`;
  }
  return new CustomError(message, 404);
};

const handlerValidationError = (err) => {
  const _msg = `${err._message}: `;
  const message = err.message.split(_msg).join("");

  return new CustomError(message, 400);
};

const handlerDuplicateError = (err) => {
  const name = err.keyValue.name;
  const message = `There is already an named width: ${name}. Please use another name.`;

  return new CustomError(message, 404);
};

const handlerJSWError = (err) => {
  const message = "Invalid Token. Please login again.";

  return new CustomError(message, 401);
};

const handlerTokenExpiredError = (err) => {
  const message = "Token has been expired.";

  return new CustomError(message, 401);
};

// CONTROLS ERRORS
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    errorDev(err, req, res);
  }

  if (process.env.NODE_ENV === "production") {
    // console.log(err);

    if (err.name === "CastError") err = handlerCastError(err);
    if (err.name === "ValidationError") err = handlerValidationError(err);
    if (err.code === 11000) err = handlerDuplicateError(err);
    if (err.name === "JsonWebTokenError") err = handlerJSWError(err);
    if (err.name === "TokenExpiredError") err = handlerTokenExpiredError(err);

    errorProd(err, req, res);
  }

  next();
};
