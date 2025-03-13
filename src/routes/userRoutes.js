const express = require("express");
const router = express.Router();
const checkAuthentication = require("../middleware/authMiddleware");
const {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  getUserCartByIdController,
  getUserOrdersByIdController,
  getUserPaymentMethodsByIdController,
} = require("../controllers/userController");

router.post("/users", addUser);
router.get("/users/:email", checkAuthentication, getUser);
router.put("/users", checkAuthentication, updateUser);
router.delete("/users/:email", checkAuthentication, deleteUser);
router.get("/users/:user_id/cart", getUserCartByIdController);
router.get("/users/:user_id/orders", getUserOrdersByIdController);
router.get(
  "/users/:user_id/payment-methods",
  getUserPaymentMethodsByIdController
);

router.post("/login", loginUser);
router.get("/logout", logoutUser);

module.exports = router;
