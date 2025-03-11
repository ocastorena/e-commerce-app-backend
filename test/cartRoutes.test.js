const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const { query } = require("../src/config/db");

describe("Cart Routes", () => {
  // Setup: ensure test user and cart are in the database
  before(async () => {
    await query(
      "INSERT INTO users (user_id, username, password, email) VALUES ($1, $2, $3, $4)",
      [1, "testuser", "password123", "testuser@example.com"]
    );
  });

  // Cleanup: remove test user and cart from the database
  after(async () => {
    await query("DELETE FROM carts WHERE user_id = $1", [1]);
    await query("DELETE FROM users WHERE user_id = $1", [1]);
  });

  describe("POST /cart", () => {
    it("should create a new cart", async () => {
      const response = await request(app).post("/cart").send({
        user_id: 1,
      });

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("user_id", 1);
    });

    it("should not create a new cart if cart already exists", async () => {
      const response = await request(app).post("/cart").send({
        user_id: 1,
      });

      expect(response.status).to.equal(409);
    });
  });

  describe("GET /cart/:user_id", () => {
    it("should fetch a cart by user ID", async () => {
      const response = await request(app).get("/cart/1");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("user_id", 1);
    });

    it("should return 404 if cart is not found", async () => {
      const response = await request(app).get("/cart/999");

      expect(response.status).to.equal(404);
    });
  });

  describe("DELETE /cart/:user_id", () => {
    it("should delete a cart by user ID", async () => {
      const response = await request(app).delete("/cart/1");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property(
        "message",
        "Cart deleted successfully"
      );
    });

    it("should return 404 if cart is not found", async () => {
      const response = await request(app).delete("/cart/999");

      expect(response.status).to.equal(404);
    });
  });
});
