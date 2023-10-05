const express = require("express");
const slugify = require("slugify");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const Product = require("../models/productModel");
const ProductCategory = require("../models/productCategoryModel");
const Brand = require("../models/brandModel");

// data raw
const products = require("../e-commerce-data/data/scraper_data/data.json");
// const productCategories = require("../e-commerce-data/data/E-Ecommerce.product_categories.json");
const brands = require("../e-commerce-data/data/brands.json");

const brand = { _id: "6509c98a8bf1036805615bf7" };
const category = { _id: "6509eca858229563c1d28c28" };

const createProduct = async (product) => {
  await Product.create({
    title: product?.title,
    slug: slugify(product?.title),
    thumb: product?.thumb,
    price: product?.price || 0,
    description: product?.description,
    brand: brand,
    category: category,
    configuration: product?.configuration,
    variants: product?.variants,
    quantity: Math.floor(Math.random() * (500 - 110 + 1) + 110),
    sold: Math.floor(Math.random() * 101),
    totalRatings: product?.totalRatings || 4.5,
    categoryName: "",
    brandName: "",
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

// Create productCategory
const createProductCategory = async (productCategory) => {
  await ProductCategory.create({
    title: productCategory?.title,
    slug: productCategory?.slug,
    image: productCategory?.image,
    brands: productCategory?.brands,
  });
};

// Insert Product Category
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

const createBrands = async (brands) => {
  await Brand.create({
    title: brands?.title,
    slug: brands?.slug,
    logo: brands?.logo,
  });
};

exports.insertBrands = asyncErrorHandler(async (req, res, next) => {
  const newBrands = [];

  for (const brand of brands) {
    newBrands.push(createBrands(brand));
  }

  await Promise.all(newBrands);
  return res.status(200).json({
    status: "success",
    message: "Load data successfully.",
  });
});
