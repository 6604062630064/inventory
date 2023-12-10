var express = require("express");
var router = express.Router();
const product_controller = require("../controllers/productControllers");
const category_controller = require("../controllers/categoryControllers");

/* GET home page. */
router.get("/", function (req, res, next) {
	res.redirect("/products");
});
router.get("/products", product_controller.product_list);
router.get("/products/add", product_controller.product_add_get);
router.get("/products/:id", product_controller.product_detail);
router.get("/products/:id/edit", product_controller.product_edit_get);
router.get("/products/:id/delete", product_controller.product_delete_get);

router.post("/products/add", product_controller.product_add_post);
router.post("/products/:id/edit", product_controller.product_edit_post);
router.post("/products/:id/delete", product_controller.product_delete_post);

router.get("/categories", category_controller.category_list);
router.get("/categories/:name/detail", category_controller.category_detail);
router.get("/categories/:name/add", category_controller.category_add_get);
router.get("/categories/:name/edit", category_controller.category_edit_get);
router.get("/categories/:name/delete", category_controller.category_delete_get);

router.post("/categories/:name/detail", category_controller.category_detail);
router.post("/categories/:name/add", category_controller.category_add_post);
router.post("/categories/:name/edit", category_controller.category_edit_post);
router.post(
	"/categories/:name/delete",
	category_controller.category_delete_post
);
module.exports = router;
