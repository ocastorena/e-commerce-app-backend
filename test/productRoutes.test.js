const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const { query } = require("../src/config/db");

describe("Product Routes", () => {
  // Setup: ensure test products are in the database
  before(async () => {
    await query(
      "INSERT INTO products (product_id, name, category, price) VALUES ($1, $2, $3, $4)",
      [1, "Test Product 1", "Category1", 10.0]
    );
    await query(
      "INSERT INTO products (product_id, name, category, price) VALUES ($1, $2, $3, $4)",
      [2, "Test Product 2", "Category2", 20.0]
    );
  });

  // Cleanup: remove test products from the database
  after(async () => {
    await query("DELETE FROM products WHERE product_id IN ($1, $2)", [1, 2]);
  });

  describe("GET /products", () => {
    it("should fetch all products", async () => {
      const response = await request(app).get("/products");
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.at.least(2);
    });
  });

  describe("GET /products/:product_id", () => {
    it("should fetch a product by ID", async () => {
      const response = await request(app).get("/products/1");
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("product_id", 1);
      expect(response.body).to.have.property("name", "Test Product 1");
    });

    it("should return 404 if product is not found", async () => {
      const response = await request(app).get("/products/999");
      expect(response.status).to.equal(404);
    });
  });

  describe("GET /products/category/:category", () => {
    it("should fetch products by category", async () => {
      const response = await request(app).get("/products/category/Category1");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body[0]).to.have.property("category", "Category1");
    });
  });

  describe("PUT /products/:id", () => {
    it("should update a product by ID", async () => {
      const response = await request(app).put("/products/1").send({
        name: "Updated Product 1",
        description: "Hello",
        stock_quantity: "100",
        category: "Updated Category",
        price: 15.0,
      });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("name", "Updated Product 1");
      expect(response.body).to.have.property("category", "Updated Category");
      expect(response.body).to.have.property("price", '15.00');
    });

    it("should return 404 if product is not found", async () => {
      const response = await request(app).put("/products/999").send({
        name: "Non-existent Product",
        category: "Non-existent Category",
        price: 0.0,
      });

      expect(response.status).to.equal(404);
    });
  });
});
