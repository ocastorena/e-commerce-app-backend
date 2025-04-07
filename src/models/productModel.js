const { query } = require("../config/db");

const getAllProducts = async () => {
  try {
    const result = await query("SELECT * FROM products", []);
    return result.rows;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};

const getProductById = async (id) => {
  try {
    const result = await query("SELECT * FROM products WHERE product_id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching product by id:", err);
    throw err;
  }
};

const getAllCategories = async () => {
  try {
    const result = await query(
      `
      SELECT * FROM (
        SELECT 0 AS id, 'All' AS category
        UNION ALL
        SELECT row_number() OVER (ORDER BY category) AS id, category
        FROM (SELECT DISTINCT category FROM products) AS categories
      ) AS all_categories
      ORDER BY id
      `,
      []
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};

const getAllProductsByCategory = async (category) => {
  try {
    const result = await query("SELECT * FROM products WHERE category = $1", [
      category,
    ]);
    return result.rows;
  } catch (err) {
    console.error("Error fetching products by category:", err);
    throw err;
  }
};

const updateProductById = async (
  id,
  { name, price, description, stock_quantity, category }
) => {
  try {
    const result = await query(
      "UPDATE products SET name = $1, price = $2, description = $3, stock_quantity = $4, category = $5 WHERE product_id = $6 RETURNING *",
      [name, price, description, stock_quantity, category, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating product in database:", err);
    throw err;
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getAllCategories,
  getAllProductsByCategory,
  updateProductById,
};
