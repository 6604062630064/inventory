const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	name: { type: String, required: true, max: 100 },
	desc: { type: String },

	// Stored as string so it's easier to check
	price: {
		type: String,
		validate: { validator: (v) => /^\d+.\d{2}$/gm.test(v) },
		required: true,
	},
	category: { type: Schema.Types.ObjectId, ref: "Category" },
	in_stock: {
		type: Number,
		default: 1,
		validate: { validator: Number.isInteger },
	},
});

ProductSchema.virtual("url").get(function () {
	// We don't use an arrow function as we'll need the this object
	return `/product/${this._id}`;
});

ProductSchema.virtual("img_url").get(function () {
	// We don't use an arrow function as we'll need the this object
	return `/img/${this._id}`;
});

// Export model
module.exports = mongoose.model("Product", ProductSchema);
