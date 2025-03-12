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

module.exports = {
  createOrder,
};
