const express = require("express");
const router = express.Router();
const {
  createOrderController,
  getOrdersByUserIdController,
  getOrderItemsByIdController,
} = require("../controllers/orderController");

router.post("/orders", createOrderController);

/**
 * @swagger
 * /orders/{order_id}:
 *   get:
 *     summary: Retrieve details of a specific order.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order.
 *     responses:
 *       '200':
 *         description: Order details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.get("/orders/:user_id", getOrdersByUserIdController);
/**
 * @swagger
 * /orders/{order_id}/items:
 *   get:
 *     summary: Retrieve items for a specific order.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order.
 *     responses:
 *       '200':
 *         description: A list of order items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 */
router.get("/orders/:order_id/items", getOrderItemsByIdController);

module.exports = router;
