const Category = require("../models/category");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
	const result = await Category.find({}, { name: 1 }).sort({ name: 1 }).exec();

	res.render("category_list", { categories: result });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
	const receivedName = req.params.name;
	const category = await Category.findOne(
		{ name: receivedName },
		{ _id: 1, name: 1 }
	).exec();

	if (!category) {
		// Will go here if not found
		res.sendStatus(404);
		return;
	}

	const result = await Product.find({ category: category._id })
		.sort({ name: 1 })
		.exec();

	res.render("category_detail", { products: result, category: category });
});

exports.category_add_get = asyncHandler(async (req, res, next) => {
	res.render("category_add");
});
exports.category_add_post = [
	body("name", "Invalid character or the first letter is not capitalized.")
		.trim()
		.isLength({ min: 1, max: 30 })
		.isAlpha("en-US", { ignore: " " })
		.matches(/^[A-Z].*$/gm)
		.custom(async (v) => {
			const result = await Category.findOne({ name: v }).exec();

			if (result !== null) throw new Error("Category already exists!");
		})
		.escape(),
	asyncHandler(async (req, res, next) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			// If error it goes here
			res.render("category_add", {
				category_name: req.body.name,
				errorMsg: result.errors,
			});
			return;
		}

		const category = new Category({ name: req.body.name });
		const createdCategory = await category.save();

		if (!createdCategory) {
			res.sendStatus(404);
		} else {
			res.redirect("/categories/");
		}
	}),
];
exports.category_edit_get = asyncHandler(async (req, res, next) => {
	const receivedName = req.params.name;
	const category = await Category.findOne(
		{ name: receivedName },
		{ _id: 1, name: 1 }
	).exec();

	if (!category) {
		// Will go here and end the function if not found
		res.sendStatus(404);
		return;
	}

	res.render("category_edit", { category_name: category.name });
});
exports.category_edit_post = [
	body("name", "Invalid character or the first letter is not capitalized.")
		.trim()
		.isLength({ min: 1, max: 30 })
		.isAlpha("en-US", { ignore: " " })
		.matches(/^[A-Z].*$/gm)
		.custom(async (v, { req }) => {
			if (v === req.params.name) {
				// In case users didn't change the name
				throw new Error("You must change the name!");
			}

			const result = await Category.findOne({ name: v }).exec();
			if (result !== null) throw new Error("Category already exists!");
		})
		.escape(),
	asyncHandler(async (req, res, next) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			// If error it goes here
			res.render("category_edit", {
				category_name: req.body.name,
				errorMsg: result.errors,
			});
			return;
		}

		const category_name = req.params.name;
		const nameToChange = req.body.name;
		const updateResult = await Category.findOneAndUpdate(
			{ name: category_name },
			{ name: nameToChange },
			{
				new: true,
			}
		);

		res.redirect(updateResult.url);
	}),
];
exports.category_delete_get = asyncHandler(async (req, res, next) => {
	// To be implemented
});
exports.category_delete_post = asyncHandler(async (req, res, next) => {
	// To be implemented
});
