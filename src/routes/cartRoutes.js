const express = require("express");
const router = express.Router();
const {
  createCartController,
  getCartByUserIdController,
  deleteCartByUserIdController,
  checkoutCartController,
} = require("../controllers/cartController");

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Create a new cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *             required:
 *               - user_id
 *     responses:
 *       '201':
 *         description: Cart created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       '400':
 *         description: Invalid input.
 */
router.post("/cart", createCartController);
/**
 * @swagger
 * /cart/{user_id}:
 *   get:
 *     summary: Retrieve details of a specific cart by user.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: Cart details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.get("/cart/:user_id", getCartByUserIdController);
/**
 * @swagger
 * /cart/{user_id}:
 *   delete:
 *     summary: Delete a cart by user.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     responses:
 *       '204':
 *         description: Cart deleted successfully. No content returned.
 *       '404':
 *         description: Cart not found.
 */
router.delete("/cart/:user_id", deleteCartByUserIdController);
/**
 * @swagger
 * /cart/{cart_id}/checkout:
 *   post:
 *     summary: Initiates checkout process and creates order if checkout was successful.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               payment_method_id:
 *                 type: integer
 *               total_amount:
 *                 type: number
 *                 format: float
 *             required:
 *               - user_id
 *               - payment_method_id
 *               - total_amount
 *     responses:
 *       '201':
 *         description: Checkout completed successfully and order created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       '400':
 *         description: Invalid input.
 */
router.post("/cart/:cartId/checkout", checkoutCartController);

module.exports = router;
