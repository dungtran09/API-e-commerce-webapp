const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Ecommerce = require("../../models/productModel");

// CONFIG ENV
dotenv.config({ path: "../../config.env" });

// CONNECT TO DB
mongoose
  .connect(process.env.DB_REMOTE_STR, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("Database connect successfully.");
  })
  .catch((error) => {
    console.log(error.message);
  });

// READ DATA and IMPORT
const importData = async () => {
  try {
    const products = JSON.parse(
      fs.readFileSync(`${__dirname}/./data2.json`, "utf-8"),
    );

    await Ecommerce.create(products);
    console.log("Load successfully.");
  } catch (error) {
    console.log(error.message);
  }
  process.exit(1);
};

// REMOVE DATA
const deleteData = async () => {
  try {
    await Ecommerce.deleteMany();
    console.log("Delete data successfully!");
  } catch (error) {
    console.log(error.message);
  }
  process.exit(1);
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--del") {
  deleteData();
}
