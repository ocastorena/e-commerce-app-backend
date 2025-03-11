const express = require("express");
const router = express.Router();
const {
  createCartController,
  getCartByUserIdController,
  deleteCartByUserIdController,
} = require("../controllers/cartController");

router.post("/cart", createCartController);
router.get("/cart/:user_id", getCartByUserIdController);
router.delete("/cart/:user_id", deleteCartByUserIdController);

module.exports = router;
