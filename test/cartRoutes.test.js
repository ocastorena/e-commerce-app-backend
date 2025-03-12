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

describe("Cart Routes - Checkout Endpoint", () => {
  // Use a dedicated test user_id, cart_id, payment_method_id for checkout
  const testUserId = 2;
  const testCartId = 10;
  const testPaymentMethodId = 210;

  // Setup: create a test user, cart, payment method
  before(async () => {
    // Insert test user
    await query(
      "INSERT INTO users (user_id, username, password, email) VALUES ($1, $2, $3, $4)",
      [testUserId, "checkoutuser", "password123", "checkout@example.com"]
    );
    // Insert payment method for user
    await query(
      "INSERT INTO payment_methods (payment_method_id, user_id ) VALUES ($1, $2)",
      [testPaymentMethodId, testUserId]
    );
    // Insert cart for the user
    const currentDate = new Date();
    await query(
      "INSERT INTO carts (cart_id, user_id, created_date) VALUES ($1, $2, $3)",
      [testCartId, testUserId, currentDate]
    );
  });

  // Cleanup: remove test data from orders, carts, and users tables
  after(async () => {
    await query("DELETE FROM orders WHERE user_id = $1", [testUserId]);
    await query("DELETE FROM carts WHERE user_id = $1", [testUserId]);
    await query("DELETE FROM payment_methods WHERE user_id = $1", [testUserId]);
    await query("DELETE FROM users WHERE user_id = $1", [testUserId]);
  });

  describe("POST /cart/:cartId/checkout", () => {
    it("should successfully checkout a valid cart and create an order", async () => {
      // Execute
      const checkoutResponse = await request(app)
        .post(`/cart/${testCartId}/checkout`)
        .send({
          user_id: testUserId,
          payment_method_id: testPaymentMethodId,
          total_amount: 100.0,
        });
      // Assert
      expect(checkoutResponse.status).to.equal(201);
      expect(checkoutResponse.body).to.have.property("order_id");
      expect(checkoutResponse.body).to.have.property("user_id", testUserId);
      expect(checkoutResponse.body).to.have.property("total_amount", "100.00");

      // After checkout, the cart should be deleted; verify by trying to fetch the cart
      const cartFetchResponse = await request(app).get(`/cart/${testUserId}`);
      expect(cartFetchResponse.status).to.equal(404);
    });

    it("should return 404 if the cart does not exist", async () => {
      // Execute
      const response = await request(app).post(`/cart/9999/checkout`).send({
        user_id: testUserId,
        payment_method_id: testPaymentMethodId,
        total_amount: 100.0,
      });
      // Assert
      expect(response.status).to.equal(404);
      expect(response.text).to.equal("Cart not found");
    });
  });
});
