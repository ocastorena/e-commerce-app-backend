const {
  getAllProducts,
  getProductById,
  getAllCategories,
  getAllProductsByCategory,
} = require("../models/productModel");

const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Server Error");
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const productId = req.params.product_id;
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).send("Server Error");
  }
};

const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json([{ slug: "All", name: "All" }, ...categories]);
  } catch (err) {
    console.error("Err fetching categories:", err);
    res.status(500).send("Server Error");
  }
};

const getAllProductsByCategoryController = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await getAllProductsByCategory(category);
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllProductsController,
  getProductByIdController,
  getAllCategoriesController,
  getAllProductsByCategoryController,
};
