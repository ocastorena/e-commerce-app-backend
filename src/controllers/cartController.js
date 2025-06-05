const { createOrder } = require("../models/orderModel");
const {
  createCart,
  getCartByUserId,
  getCartById,
  addItemToCart,
  getCartItems,
  updateCartItemQuantity,
  deleteCartByUserId,
  deleteItemFromCart,
  deleteCartItemsByCartId,
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

const addItemToCartController = async (req, res) => {
  try {
    const cart_id = req.params.cart_id;
    const { product_id, quantity } = req.body;

    // TODO: add validation
    await addItemToCart(cart_id, product_id, quantity);
    res.status(200).send("Cart updated successfully");
  } catch (error) {
    console.error("Error updating cart: ", error);
    res.status(500).send("Server Error");
  }
};

const getCartItemsController = async (req, res) => {
  try {
    const cart_id = req.params.cart_id;

    const cartItems = await getCartItems(cart_id);

    if (!cartItems) {
      return res.status(404).send("Cart items not found");
    }
    return res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error getting cart items: ", error);
    res.status(500).send("Server Error");
  }
};

const updateCartItemQuantityController = async (req, res) => {
  try {
    const cart_id = req.params.cart_id;
    const product_id = req.params.product_id;
    const { quantity } = req.body;

    const updatedItem = await updateCartItemQuantity(
      cart_id,
      product_id,
      quantity
    );

    if (!updatedItem) {
      return res.status(404).send("Cart item not found");
    }
    return res.status(200).json(updatedItem);
  } catch (error) {}
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

const deleteItemFromCartController = async (req, res) => {
  try {
    const { cart_id, product_id } = req.params;
    if (!cart_id || !product_id) {
      return res.status(400).json({ message: "Missing cart_id or product_id" });
    }

    const deletedItem = await deleteItemFromCart(cart_id, product_id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    return res.status(200).json({
      message: "Item removed from cart successfully",
      data: deletedItem,
    });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteCartItemsByCartIdController = async (req, res) => {
  try {
    const { cart_id } = req.params;
    if (!cart_id) {
      return res.status(400).json({ message: "Missing cart_id" });
    }

    const deletedItems = await deleteCartItemsByCartId(cart_id);
    if (!deletedItems) {
      return res.status(404).json({ message: "cart items not found" });
    }

    return res
      .status(200)
      .json({ message: "All items removed from cart successfully" });
  } catch (error) {
    console.error("Error deleting all items from cart");
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCartController,
  getCartByUserIdController,
  addItemToCartController,
  getCartItemsController,
  updateCartItemQuantityController,
  deleteCartByUserIdController,
  checkoutCartController,
  deleteItemFromCartController,
  deleteCartItemsByCartIdController,
};
