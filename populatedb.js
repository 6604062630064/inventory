#! /usr/bin/env node
require("dotenv").config();

// Get arguments passed on command line

const Category = require("./models/category");
const Product = require("./models/product");

const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.KEY;

main().catch((err) => console.log(err));

async function main() {
	console.log("Debug: About to connect");
	await mongoose.connect(mongoDB);

	console.log("Debug: Should be connected?");
	await mongoose.connection.dropDatabase();
	console.log("Debug: Cleard database");
	await createCategories();

	await createProducts();

	console.log("Debug: Closing mongoose");
	mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
	const category = new Category({ name: name });
	await category.save();
	categories[index] = category;
	console.log(`Added category: ${name}`);
}

async function productCreate(name, desc, price, category, in_stock) {
	const product = new Product({
		name: name,
		desc: desc,
		price: price,
		category: category,
		in_stock: in_stock,
	});
	await product.save();
	console.log(`Added product: ${name}`);
}

async function createProducts() {
	console.log("Adding products");
	await Promise.all([
		productCreate(
			"Laptop",
			"A laptop computer or notebook computer, also known as a laptop or notebook for short, is a small, portable personal computer",
			"499.99",
			categories[0],
			10
		),
		productCreate(
			"Car",
			"a four-wheeled road vehicle that is powered by an engine and is able to carry a small number of people.",
			"699.99",
			categories[1],
			2
		),
		productCreate(
			"PC",
			"A personal computer (PC) is a multi-purpose microcomputer whose size, capabilities, and price make it feasible for individual use",
			"299.99",
			categories[0],
			50
		),
		productCreate("Chocolate", "", "1.99", categories[2], 10002),
		productCreate("Potato Chip", "", "1.99", categories[2], 3341),
	]);
}
async function createCategories() {
	console.log("Adding categories");
	await Promise.all([
		categoryCreate(0, "Computer"),
		categoryCreate(1, "Car"),
		categoryCreate(2, "Food"),
	]);
}
