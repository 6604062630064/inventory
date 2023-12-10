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

	console.log(result);
	res.render("category_detail", { products: result, category: category });
});

exports.category_add_get = asyncHandler(async (req, res, next) => {
	res.render("category_add");
});
exports.category_add_post = [
	body("name", "Invalid character or the first letter is not capitalized.")
		.trim()
		.isAlpha("en-US", { ignore: " " })
		.matches(/^[A-Z].*$/gm)
		.escape(),
	asyncHandler(async (req, res, next) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			// If error it goes here
			res.sendStatus(404);
			res.render("category_add", { body: req.body });
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
	res.sendStatus(202);
});
exports.category_edit_post = asyncHandler(async (req, res, next) => {
	res.write("To be implemented");
});
exports.category_delete_get = asyncHandler(async (req, res, next) => {
	// To be implemented
});
exports.category_delete_post = asyncHandler(async (req, res, next) => {
	// To be implemented
});
