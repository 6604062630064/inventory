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
	const categories = await Category.find({}, { name: 1, _id: 0 }).exec();
	res.render("product_add", { extraScript: true, categories: categories });
});
exports.product_add_post = [
	body("name")
		.trim()
		.isLength({ min: 1, max: 100 })
		.withMessage("Name length must be between 1 to 100")
		.escape(),
	body("desc")
		.trim()
		.isLength({ max: 600 })
		.withMessage("Description exceeds 600 characters.")
		.escape(),
	body("price")
		.trim()
		.matches(/^([1-9]\d*|0)\.[0-9]{2}$/gm)
		.withMessage(
			"Price must have 2 decimal places and no leading zero eg. 2.34, 0.69"
		)
		.escape(),
	body("category")
		.trim()
		.escape()
		.custom(async (value) => {
			const result = await Category.findOne({ name: value }).exec();
			// if it finds nothing, it will return null
			if (!result) {
				throw new Error(`${value} does not exist!`);
			}
		}),
	body("in_stock")
		.escape()
		.isNumeric()
		.withMessage("Must be numbers!")

		.toInt()
		.custom(async (v) => {
			if (!(v >= 1 && v <= 100000)) {
				throw new Error("Value of In stock must be between 1 and 99999");
			}
		}),
	asyncHandler(async (req, res, next) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			// Do something if throwing error
			const categories = await Category.find({}, { name: 1, _id: 0 }).exec();
			res.render("product_add", {
				extraScript: true,
				categories: categories,
				errorMsg: result.errors,
				body: req.body,
			});
			return;
		}

		// if it passes validation, continue here
		const category = await Category.findOne(
			{ name: req.body.category },
			{ _id: 1 }
		).exec();

		const product = new Product({
			name: req.body.name,
			desc: req.body.desc,
			price: req.body.price,
			category: category._id,
			in_stock: req.body.in_stock,
		});
		// Saving
		await product
			.save()
			.then((savedOne) => {
				// If it's successful, go here
				const _id = savedOne._id;
				res.redirect("/products/" + _id);
			})
			.catch((err) => {
				console.log(err);
				res.sendStatus(500);
			});

		res.sendStatus(202);
	}),
];
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
