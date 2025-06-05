const axios = require("axios");

const DUMMYJSON_BASE = "https://dummyjson.com/products";

const fetchFromDummyJson = async (endpoint) => {
  try {
    const response = await axios.get(`${DUMMYJSON_BASE}${endpoint}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    throw err;
  }
};

const getAllProducts = async () => {
  const data = await fetchFromDummyJson("?limit=100");
  return data.products;
};

const getProductById = async (id) => {
  return await fetchFromDummyJson(`/${id}`);
};

const getAllCategories = async () => {
  return await fetchFromDummyJson("/categories");
};

const getAllProductsByCategory = async (category) => {
  const data = await fetchFromDummyJson(
    `/category/${encodeURIComponent(category)}`
  );
  return data.products;
};

module.exports = {
  getAllProducts,
  getProductById,
  getAllCategories,
  getAllProductsByCategory,
};
