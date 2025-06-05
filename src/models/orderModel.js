const { query, pool } = require("../config/db");
const axios = require("axios");

const fetchProductFromDummyJson = async (product_id) => {
  try {
    const response = await axios.get(
      `https://dummyjson.com/products/${product_id}`
    );
    return response.data;
  } catch (err) {
    console.error(`Error fetching product ${product_id}:`, err);
    throw err;
  }
};

const createOrder = async (
  user_id,
  payment_method_id,
  order_date,
  _total_amount, // ignored, always recalculated
  orderItems
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let calculatedTotal = 0;
    const itemsWithPrice = await Promise.all(
      orderItems.map(async (item) => {
        const product = await fetchProductFromDummyJson(item.product_id);
        const unit_price = product.price;
        calculatedTotal += unit_price * item.quantity;
        return { ...item, unit_price };
      })
    );

    const orderResult = await client.query(
      "INSERT INTO orders (user_id, payment_method_id, order_date, total_amount) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, payment_method_id, order_date, calculatedTotal]
    );
    const order = orderResult.rows[0];

    for (const item of itemsWithPrice) {
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
      "SELECT product_id, quantity, unit_price FROM order_items WHERE order_id = $1",
      [order_id]
    );
    const orderItems = result.rows;

    const detailedItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await fetchProductFromDummyJson(item.product_id);
        return {
          ...item,
          product,
        };
      })
    );

    return detailedItems;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrderItemsById,
};
