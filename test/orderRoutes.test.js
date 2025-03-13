const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const { query } = require("../src/config/db");

describe("Order Routes", () => {
  let testOrderId;

  before(async () => {
    // Insert a test user so orders can reference a valid user_id.
    await query(
      "INSERT INTO users (user_id, username, password, email) VALUES ($1, $2, $3, $4)",
      [3, "orderTester", "password123", "orderTester@example.com"]
    );

    // Insert a test payment method with payment_method_id = 301.
    // Adjust the column names as needed (here we assume columns: payment_method_id, user_id, card_number).
    await query(
      "INSERT INTO payment_methods (payment_method_id, user_id) VALUES ($1, $2)",
      [301, 3]
    );

    // Insert a test order into the orders table.
    const currentDate = new Date();
    const orderResult = await query(
      "INSERT INTO orders (user_id, payment_method_id, order_date, total_amount) VALUES ($1, $2, $3, $4) RETURNING *",
      [3, 301, currentDate, 50.0]
    );
    testOrderId = orderResult.rows[0].order_id;

    // Insert a test order item for the created order.
    await query(
      "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
      [testOrderId, 24, 2, 25.0]
    );
  });

  after(async () => {
    // Clean up: remove test order items and order.
    await query("DELETE FROM order_items WHERE order_id = $1", [testOrderId]);
    await query("DELETE FROM orders WHERE order_id = $1", [testOrderId]);
    // Remove test payment method and test user.
    await query("DELETE FROM payment_methods WHERE payment_method_id = $1", [
      301,
    ]);
    await query("DELETE FROM users WHERE user_id = $1", [3]);
  });

  describe("GET /orders/:order_id", () => {
    it("should fetch an order by ID", async () => {
      const response = await request(app).get(`/orders/${testOrderId}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("order_id", testOrderId);
      expect(response.body).to.have.property("user_id", 3);
      expect(response.body)
        .to.have.property("total_amount")
        .that.satisfies((val) => +val === 50.0);
    });

    it("should return 404 if the order is not found", async () => {
      const response = await request(app).get("/orders/999999");
      expect(response.status).to.equal(404);
    });
  });

  describe("GET /orders/:order_id/items", () => {
    it("should fetch items for an order", async () => {
      const response = await request(app).get(`/orders/${testOrderId}/items`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.at.least(1);
      expect(response.body[0]).to.have.property("product_id", 24);
      expect(response.body[0]).to.have.property("quantity", 2);
      expect(response.body[0])
        .to.have.property("unit_price")
        .that.satisfies((val) => +val === 25.0);
    });

    it("should return 404 if no order items are found for a non-existent order", async () => {
      const response = await request(app).get("/orders/999999/items");
      expect(response.status).to.equal(404);
    });
  });
});
