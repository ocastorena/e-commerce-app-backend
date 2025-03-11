const express = require("express");
const router = express.Router();
const {
  getAllProductsController,
  getProductByIdController,
  getAllProductsByCategoryController,
  updateProductByIdController,
} = require("../controllers/productController");

router.get("/products", getAllProductsController);
router.get("/products/category/:category", getAllProductsByCategoryController);
router.get("/products/:product_id", getProductByIdController);
router.put("/products/:product_id", updateProductByIdController);

module.exports = router;
