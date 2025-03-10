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

module.exports = {
  createUser,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
};
