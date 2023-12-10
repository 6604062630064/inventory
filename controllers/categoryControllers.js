const Category = require("../models/category");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
	const result = await Category.find({}, { name: 1 }).sort({ name: 1 }).exec();

	res.render("category_list", { categories: result });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
	// To be implemented
});

exports.category_add_get = asyncHandler(async (req, res, next) => {
	// To be implemented
});
exports.category_add_post = asyncHandler(async (req, res, next) => {
	// To be implemented
});
exports.category_edit_get = asyncHandler(async (req, res, next) => {
	// To be implemented
});
exports.category_edit_post = asyncHandler(async (req, res, next) => {
	// To be implemented
});
exports.category_delete_get = asyncHandler(async (req, res, next) => {
	// To be implemented
});
exports.category_delete_post = asyncHandler(async (req, res, next) => {
	// To be implemented
});
