const express = require("express");
const router = express.Router();
const {
  getAllProductsController,
  getAllProductsByCategoryController,
  getProductByIdController,
  updateProductByIdController,
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
router.get("/products/:product_id", getProductByIdController);
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
/**
 * @swagger
 * /products/{product_id}:
 *   put:
 *     summary: Update an existing product by Id.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               description:
 *                 type: string
 *               stock_quantity:
 *                 type: integer
 *               category:
 *                 type: string
 *             example:
 *               name: apple
 *               price: 1.99
 *               description: "Red Apple"
 *               stock_quantity: 10
 *               category: "fruit"
 *     responses:
 *       '200':
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Invalid input.
 *       '404':
 *         description: User not found.
 */
router.put("/products/:product_id", updateProductByIdController);

module.exports = router;
