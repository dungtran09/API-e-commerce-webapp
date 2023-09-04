const express = require("express");
const slugify = require("slugify");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const Product = require("../models/productModel");
const ProductCategory = require("../models/productCategoryModel");

// data raw
const products = require("../e-commerce-data/data/products.json");
const productCategories = require("../e-commerce-data/data/productCategory.json");

const createProduct = async (product) => {
  await Product.create({
    title: product?.name,
    slug: slugify(product?.name),
    description: product?.description,
    brand: product?.brand,
    price: product?.price,
    category: product?.category,
    quantity: product?.quantity,
    sold: product?.sold,
    images: product?.images,
    colors: product?.colors,
    totalRatings: product?.totalRatings,
  });
};

// Insert Products
exports.insertProducts = asyncErrorHandler(async (req, res, next) => {
  const newProducts = [];
  for (const product of products) {
    newProducts.push(createProduct(product));
  }

  await Promise.all(newProducts);
  return res.status(200).json({
    status: "success",
    message: "Load data successfully.",
  });
});

// Insert Product Category
const createProductCategory = async (productCategory) => {
  await ProductCategory.create({
    title: productCategory?.title,
    brand: productCategory?.brand,
  });
};

exports.insertProductCategory = asyncErrorHandler(async (req, res, next) => {
  const newProductCategories = [];
  for (const productCategory of productCategories) {
    newProductCategories.push(createProductCategory(productCategory));
  }

  await Promise.all(newProductCategories);
  return res.status(200).json({
    status: "success",
    message: "Load data successfully.",
  });
});
