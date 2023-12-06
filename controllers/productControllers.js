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
	const product = await Product.findById(id).populate("category").exec();
	console.log(product);
	console.log(product.category_url);
	res.render("product_detail", { product: product });
});

exports.product_add_get = asyncHandler(async (req, res, next) => {
	const categories = await Category.find({}).exec();
	res.render("product_add", { extraScript: true, categories: categories });
});
exports.product_add_post = asyncHandler(async (req, res, next) => {
	res.sendStatus(202);
});
exports.product_edit_get = asyncHandler(async (req, res, next) => {
	res.sendStatus(202);
});
exports.product_edit_post = asyncHandler(async (req, res, next) => {
	res.sendStatus(202);
});
exports.product_delete_get = asyncHandler(async (req, res, next) => {
	// To be implemented
});
exports.product_delete_post = asyncHandler(async (req, res, next) => {
	// To be implemented
});
