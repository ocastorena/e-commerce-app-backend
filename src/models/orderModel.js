const { query } = require("../config/db");

const createOrder = async (
  user_id,
  payment_method_id,
  order_date,
  total_amount
) => {
  try {
    const result = await query(
      "INSERT INTO orders (user_id, payment_method_id, order_date, total_amount) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, payment_method_id, order_date, total_amount]
    );
    return result.rows[0];
  } catch (err) {
    //console.error("Error creating cart in database:", err);
    throw err;
  }
};

const getOrderById = async (order_id) => {
  try {
    const result = await query("SELECT * FROM orders WHERE order_id = $1", [
      order_id,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getOrderItemsById = async (order_id) => {
  try {
    const result = await query(
      "SELECT * FROM order_items where order_id = $1",
      [order_id]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrderItemsById,
};
