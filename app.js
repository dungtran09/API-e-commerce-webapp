//For secure API and DATA
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
/*------------------------------------------------------------------------*/
const express = require("express");
const morgan = require("morgan");
const CustomError = require("./utils/CustomError");
const globalErrorController = require("./controllers/globalErrorController");
const usersRouter = require("./routers/usersRouter");
const productsRouter = require("./routers/productsRouter");
const productCategoriesRouter = require("./routers/productCategoriesRouter");
const blogCategoriesRouter = require("./routers/blogCategoriesRouter");
const blogsRouter = require("./routers/blogsRouter");
const brandsRouter = require("./routers/brandsRouter");
const couponsRouter = require("./routers/couponsRouter");
const ordersRouter = require("./routers/ordersRouter");

const insertDataRouter = require("./routers/insertDataRouter");
/*------------------------------------------------------------------------*/

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: ["POST", "PUT", "GET", "PATCH", "DELETE"],
  }),
);

//  parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json({ limit: "50kb" }));

// data sanitization against Nosql query injection
app.use(mongoSanitize());

// data sanitization again site script xss
app.use(xss());

// prevent parameter population
app.use(
  hpp({
    whitelist: ["price", "quantity", "ratings", "totalRatings"],
  }),
);

//  parses incoming requests with URL-encoded payloads and is based on a body parser.
app.use(express.urlencoded({ extended: true }));

// secure header http
app.use(helmet());

// cookies
app.use(cookieParser());

/*------GLOBAL MIDDWARE------*/

// limit rate
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, Please try again in an hour.",
});
app.use("/api", limiter);

// display info request in console
app.use(morgan("dev"));

// routers
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/productCategories", productCategoriesRouter);
app.use("/api/v1/blogCategories", blogCategoriesRouter);
app.use("/api/v1/blogs", blogsRouter);
app.use("/api/v1/brands", brandsRouter);
app.use("/api/v1/coupons", couponsRouter);
app.use("/api/v1/orders", ordersRouter);

app.use("/api/v1/insert", insertDataRouter);

app.all("*", (req, res, next) => {
  next(new CustomError(`Url ${req.originalUrl} is not found.`, 404));
});

// handler global error
app.use(globalErrorController);

module.exports = app;
