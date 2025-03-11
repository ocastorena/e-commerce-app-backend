const {
  createCart,
  getCartByUserId,
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

module.exports = {
  createCartController,
  getCartByUserIdController,
  deleteCartByUserIdController,
};
