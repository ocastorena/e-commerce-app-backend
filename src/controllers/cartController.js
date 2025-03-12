const { createOrder } = require("../models/orderModel");
const {
  createCart,
  getCartByUserId,
  getCartById,
  deleteCartByUserId,
} = require("../models/cartModel");

const createCartController = async (req, res) => {
  try {
    const { user_id } = req.body;
    const newCart = await createCart(user_id);
    res.status(201).json(newCart);
  } catch (err) {
    if (err.message === "Cart already exists") {
      return res.status(409).send("Cart already exists");
    }
    console.error("Error creating cart:", err);
    res.status(500).send("Server Error");
  }
};

const getCartByUserIdController = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const cart = await getCartByUserId(user_id);

    if (!cart) {
      return res.status(404).send("Cart not found");
    }
    return res.status(200).json(cart);
  } catch (err) {
    console.error("Error fetching cart by user id:", err);
    res.status(500).send("Server Error");
  }
};

const deleteCartByUserIdController = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const deletedCart = await deleteCartByUserId(user_id);

    if (!deletedCart) {
      return res.status(404).send("Cart not found");
    }
    return res.status(200).json({ message: "Cart deleted successfully" });
  } catch (err) {
    console.error("Error deleting cart by user id:", err);
    res.status(500).send("Server Error");
  }
};

// New Checkout Controller
const checkoutCartController = async (req, res) => {
  try {
    // validate the cart ensure that it exists
    const cartId = req.params.cartId;
    const cart = await getCartById(cartId);
    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    // Simulate payment processing.
    // For now we assume all charges succeed
    const paymentSucceeded = true; // Simulated result
    if (!paymentSucceeded) {
      throw new Error("Payment processing failed");
    }

    // Create an order.
    const { user_id, payment_method_id, total_amount } = req.body;
    const currentDate = new Date();
    const newOrder = await createOrder(
      user_id,
      payment_method_id,
      currentDate,
      total_amount
    );

    // Delete the cart after a successful checkout.
    await deleteCartByUserId(cart.user_id);

    return res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error during checkout:", err);
    return res.status(500).send("Checkout failed due to server error");
  }
};

module.exports = {
  createCartController,
  getCartByUserIdController,
  deleteCartByUserIdController,
  checkoutCartController,
};
