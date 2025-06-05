const express = require("express");
const router = express.Router();
const {
  getAllProductsController,
  getAllCategoriesController,
  getAllProductsByCategoryController,
  getProductByIdController,
} = require("../controllers/productController");

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of all products.
 *     description: Retrieve a list of all products with optional pagination and search filtering.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of products per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Keyword for product search.
 *     responses:
 *       '200':
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/products", getAllProductsController);
/**
 * @swagger
 * /products/{product_id}:
 *   get:
 *     summary: Retrieve a specific product.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product.
 *     responses:
 *       '200':
 *         description: Details of the product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get("/products/:product_id(\\d+)", getProductByIdController);

/**
 * @swagger
 * /products/categories:
 *   get:
 *     summary: Retrieve a list of all product categories.
 *     tags:
 *       - Products
 *     responses:
 *       '200':
 *         description: A list of distinct product categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get("/products/categories", getAllCategoriesController);

/**
 * @swagger
 * /products/{category}:
 *   get:
 *     summary: Retrieve all products from a specific category
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The category of the product.
 *     responses:
 *       '200':
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get("/products/category/:category", getAllProductsByCategoryController);

module.exports = router;
