const { query } = require("../config/db");

const createUser = async (username, password, email, address) => {
  try {
    // Check if the user already exists
    const existingUser = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existingUser.rows.length > 0) {
      throw new Error("User already exists");
    }

    const result = await query(
      "INSERT INTO users (username, password, email, address) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, password, email, address]
    );
    return result.rows[0];
  } catch (err) {
    //console.error("Error creating user in database:", err);
    throw err;
  }
};

const getUserByEmail = async (email) => {
  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching user by email:", err);
    throw err;
  }
};

const getUserById = async (id) => {
  try {
    const result = await query("SELECT * FROM users WHERE user_id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    throw err;
  }
};

const updateUserByEmail = async (email, { username, password, address }) => {
  try {
    const result = await query(
      "UPDATE users SET username = $1, password = COALESCE($2, password), address = $3 WHERE email = $4 RETURNING *",
      [username, password, address, email]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating user in database:", err);
    throw err;
  }
};

const deleteUserByEmail = async (email) => {
  try {
    const result = await query(
      "DELETE FROM users WHERE email = $1 RETURNING *",
      [email]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error deleting user from database:", err);
    throw err;
  }
};

const getUserCartById = async (user_id) => {
  try {
    const result = await query("SELECT * from carts WHERE user_id = $1", [
      user_id,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching cart by user_id:", err);
    throw err;
  }
};

const getUserOrdersById = async (user_id) => {
  try {
    const result = await query("SELECT * from orders WHERE user_id = $1", [
      user_id,
    ]);
    return result.rows;
  } catch (err) {
    console.error("Error fetching orders by user_id:", err);
    throw err;
  }
};

const getUserPaymentMethodsById = async (user_id) => {
  try {
    const result = await query(
      "SELECT * from payment_methods WHERE user_id = $1",
      [user_id]
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching payment methods by user_id:", err);
    throw err;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserByEmail,
  deleteUserByEmail,
  getUserCartById,
  getUserOrdersById,
  getUserPaymentMethodsById,
};
