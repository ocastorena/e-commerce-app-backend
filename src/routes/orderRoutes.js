const express = require("express");
const router = express.Router();
const {
  getOrderByIdController,
  getOrderItemsByIdController,
} = require("../controllers/orderController");

router.get("/orders/:order_id", getOrderByIdController);
router.get("/orders/:order_id/items", getOrderItemsByIdController);

module.exports = router;
