const express = require("express");
const router = express.Router();
const {
  createCartController,
  getCartByUserIdController,
  deleteCartByUserIdController,
  checkoutCartController,
} = require("../controllers/cartController");

router.post("/cart", createCartController);
router.get("/cart/:user_id", getCartByUserIdController);
router.delete("/cart/:user_id", deleteCartByUserIdController);
router.post("/cart/:cartId/checkout", checkoutCartController);

module.exports = router;
