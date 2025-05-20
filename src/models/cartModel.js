const { query } = require("../config/db");

const createCart = async (user_id) => {
  try {
    // Check if cart already exists
    const existingCart = await query("SELECT * FROM carts WHERE user_id = $1", [
      user_id,
    ]);
    if (existingCart.rows.length > 0) {
      throw new Error("Cart already exists");
    }

    // Get the current date
    const currentDate = new Date();

    const result = await query(
      "INSERT INTO carts (user_id, created_date) VALUES ($1, $2) RETURNING *",
      [user_id, currentDate]
    );
    return result.rows[0];
  } catch (err) {
    //console.error("Error creating cart in database:", err);
    throw err;
  }
};

const getCartByUserId = async (user_id) => {
  try {
    const result = await query("SELECT * FROM carts WHERE user_id = $1", [
      user_id,
    ]);
    return result.rows[0];
  } catch (err) {
    //console.error("Error fetching cart from database:", err);
    throw err;
  }
};

const getCartById = async (cart_id) => {
  try {
    const result = await query("SELECT * FROM carts WHERE cart_id = $1", [
      cart_id,
    ]);
    return result.rows[0];
  } catch (err) {
    //console.error("Error fetching cart from database:", err);
    throw err;
  }
};

const addItemToCart = async (cart_id, product_id, quantity) => {
  try {
    const result = await query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [cart_id, product_id, quantity]
    );
    return result.rows;
  } catch (error) {
    console.error("Error in addItemToCart:", error);
    throw error;
  }
};

const getCartItems = async (cart_id) => {
  try {
    const result = await query(
      `SELECT p.product_id, p.imageurl, p.name, p.price, ci.quantity, p.stock_quantity 
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.product_id
       WHERE ci.cart_id = $1`,
      [cart_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error in getCartItems:", error);
    throw error;
  }
};

const updateCartItemQuantity = async (cart_id, product_id, quantity) => {
  try {
    const result = await query(
      "UPDATE cart_items SET quantity = $3 WHERE cart_id = $1 AND product_id = $2 RETURNING *",
      [cart_id, product_id, quantity]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating item quantity in cart:", error);
    throw error;
  }
};

const deleteCartByUserId = async (user_id) => {
  try {
    const result = await query(
      "DELETE FROM carts WHERE user_id = $1 RETURNING *",
      [user_id]
    );
    return result.rows[0];
  } catch (err) {
    //console.error("Error deleting cart from database:", err);
    throw err;
  }
};

const deleteItemFromCart = async (cart_id, product_id) => {
  try {
    const result = await query(
      "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *",
      [cart_id, product_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    throw error;
  }
};

module.exports = {
  createCart,
  getCartByUserId,
  getCartById,
  addItemToCart,
  getCartItems,
  updateCartItemQuantity,
  deleteCartByUserId,
  deleteItemFromCart,
};
