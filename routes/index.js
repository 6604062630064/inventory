var express = require("express");
var router = express.Router();
const product_controller = require("../controllers/productControllers");
const category_controller = require("../controllers/categoryControllers");

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});
router.get("/products", product_controller.product_list);
router.get("/products/:id", product_controller.product_detail);
router.get("/products/:id/add", product_controller.product_add);
router.get("/products/:id/edit", product_controller.product_edit);
router.get("/products/:id/delete", product_controller.product_delete);

router.get("/categories/:id/detail", category_controller.category_detail);
router.get("/categories/:id/add", category_controller.category_add);
router.get("/categories/:id/edit", category_controller.category_edit);
router.get("/categories/:id/delete", category_controller.category_delete);

module.exports = router;
