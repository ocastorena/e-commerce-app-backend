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

module.exports = {
  createCart,
  getCartByUserId,
  getCartById,
  deleteCartByUserId,
};
