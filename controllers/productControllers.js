const Category = require("../models/category");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.product_list = asyncHandler(async (req, res, next) => {
	const products = await Product.find(
		{},
		{ name: 1, price: 1, in_stock: 1, _id: 1 }
	).exec();
	console.log(products[0].url);
	res.render("product_list", { products: products });
});

exports.product_detail = asyncHandler(async (req, res, next) => {
	const id = req.params.id;
	const product = await Product.findById(id).exec();
});

exports.product_add = asyncHandler(async (req, res, next) => {
	// To be implemented
});
exports.product_edit = asyncHandler(async (req, res, next) => {
	// To be implemented
});
exports.product_delete = asyncHandler(async (req, res, next) => {
	// To be implemented
});
