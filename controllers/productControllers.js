const Category = require("../models/category");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const validationChain = [
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

		.custom(async (value) => {
			const result = await Category.findOne({ name: value }).exec();
			// if it finds nothing, it will return null
			if (!result) {
				throw new Error(`${value} does not exist!`);
			}
		})
		.escape(),
	body("in_stock")
		.isNumeric()
		.withMessage("Must be numbers!")

		.toInt()
		.custom(async (v) => {
			if (!(v >= 1 && v <= 100000)) {
				throw new Error("Value of In stock must be between 1 and 99999");
			}
		})
		.escape(),
];

exports.product_list = asyncHandler(async (req, res, next) => {
	const products = await Product.find(
		{},
		{ name: 1, price: 1, in_stock: 1, _id: 1 }
	).exec();
	res.render("product_list", { products: products });
});

exports.product_detail = asyncHandler(async (req, res, next) => {
	const id = req.params.id;
	const product = await Product.findOne({ _id: id })
		.populate("category")
		.exec()
		.catch((err) => {
			res.sendStatus(404);
		});

	res.render("product_detail", { product: product });
});

exports.product_add_get = asyncHandler(async (req, res, next) => {
	const categories = await Category.find({}, { name: 1, _id: 0 }).exec();
	res.render("product_add", { extraScript: true, categories: categories });
});
exports.product_add_post = [
	validationChain,
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
		} else {
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
					res.redirect(savedOne.url);
				})
				.catch((err) => {
					res.sendStatus(404);
				});

			res.sendStatus(202);
		}
	}),
];
exports.product_edit_get = asyncHandler(async (req, res, next) => {
	const id = req.params.id;
	const product = await Product.findOne({ _id: id })
		.populate("category")
		.exec()
		.catch((err) => {
			res.sendStatus(404);
		});
	const categories = await Category.find({}, { name: 1, _id: 0 }).exec();

	res.render("product_edit", {
		body: product,
		categories: categories,
		category_name: product.category.name,
		extraScript: true,
	});
});
exports.product_edit_post = [
	validationChain,
	asyncHandler(async (req, res, next) => {
		const result = validationResult(req);

		if (!result.isEmpty()) {
			// Do something if throwing error
			console.log(req.body.category);
			const categories = await Category.find({}, { name: 1, _id: 0 }).exec();
			res.render("product_edit", {
				extraScript: true,
				categories: categories,
				category_name: req.body.category,
				errorMsg: result.errors,
				body: req.body,
			});
		} else {
			const id = req.params.id;
			const category = await Category.findOne(
				{ name: req.body.category },
				{ _id: 1 }
			).exec();

			await Product.findByIdAndUpdate(
				{ _id: id },
				{
					name: req.body.name,
					price: req.body.price,
					desc: req.body.desc,
					in_stock: req.body.in_stock,
					category: category._id,
				}
			)
				.then((result) => {
					const _id = result._id;
					res.redirect(result.url);
				})
				.catch((err) => {
					res.sendStatus(404);
				});
		}
	}),
];
exports.product_delete_get = asyncHandler(async (req, res, next) => {
	const req_id = req.params.id;
	const delete_key = await Product.findById({ _id: req_id }, { name: 1 })
		.exec()
		.catch((err) => {
			res.sendStatus(404);
		});
	res.render("product_delete", { delete_key: delete_key.name });
});
exports.product_delete_post = [
	body("name")
		.custom(async (v, { req }) => {
			const id = req.params.id;
			const result = await Product.findOne({ _id: id }, { name: 1 })
				.exec()
				.catch((err) => {
					throw new Error(`Not found`);
				});
			if (v !== result.name) {
				// If names are not matched, throw error
				throw new Error(`Name mismatch`);
			}
		})
		.escape(),

	asyncHandler(async (req, res, next) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			// Error
			const delete_key = await Product.findById(
				{ _id: req.params.id },
				{ name: 1 }
			).exec();
			res.render("product_delete", {
				delete_key: delete_key.name,
				errorMsg: result.errors,
			});
		} else {
			const id = req.params.id;
			Product.findOneAndDelete({ _id: id })
				.exec()
				.then((a) => {
					res.redirect("/products");
				})
				.catch((err) => {
					res.sendStatus(404);
				});
		}
	}),
];
