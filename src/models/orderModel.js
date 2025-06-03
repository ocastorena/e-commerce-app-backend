const { query, pool } = require("../config/db");

const createOrder = async (
  user_id,
  payment_method_id,
  order_date,
  total_amount,
  orderItems
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Create the order
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, payment_method_id, order_date, total_amount) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, payment_method_id, order_date, total_amount]
    );
    const order = orderResult.rows[0];

    // Insert order items
    for (const item of orderItems) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
        [order.order_id, item.product_id, item.quantity, item.unit_price]
      );
    }

    await client.query("COMMIT");
    return order;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getOrdersByUserId = async (user_id) => {
  try {
    const result = await query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC",
      [user_id]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const getOrderItemsById = async (order_id) => {
  try {
    const result = await query(
      `SELECT oi.*, p.name AS product_name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = $1`,
      [order_id]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrderItemsById,
};
