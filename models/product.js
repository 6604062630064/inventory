const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	name: { type: String, required: true },
	desc: { type: String },
	in_stock: {
		type: Number,
		default: 1,
		validate: { validator: Number.isInteger },
	},
	// Stored as string so it's easier to check
	price: {
		type: String,
		validate: { validator: (v) => /\d+\.\d{2}/gm.test(v) },
		required: true,
	},
	category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

ProductSchema.virtual("url").get(function () {
	// We don't use an arrow function as we'll need the this object
	return `/product/${this._id}`;
});

// Export model
module.exports = mongoose.model("Product", ProductSchema);
