const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const { query } = require("../src/config/db");

describe("User Routes", () => {
  let agent;

  // Setup: ensure test user is not in database
  before(async () => {
    await query("DELETE FROM users WHERE email = $1", ["testuser@example.com"]);
  });

  // Cleanup: remove test user from database
  after(async () => {
    await query("DELETE FROM users WHERE email = $1", ["testuser@example.com"]);
  });

  describe("Requests that don't require authentication", () => {
    describe("Creating a user", () => {
      it("should create a new user", async () => {
        // Execute
        const response = await request(app).post("/users").send({
          username: "testuser",
          password: "password123",
          email: "testuser@example.com",
          address: "123 Test St",
        });

        // Assert
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property("username", "testuser");
        expect(response.body).to.have.property("email", "testuser@example.com");
      });

      it("should not create a new user when user aleady exists", async () => {
        // Execute
        const response = await request(app).post("/users").send({
          username: "testuser",
          password: "password123",
          email: "testuser@example.com",
          address: "123 Test St",
        });

        // Assert
        expect(response.status).to.equal(409);
      });
    });
  });

  describe("Requests that require authentication", () => {
    // Setup: login with test user
    before(async () => {
      agent = request.agent(app);
      await agent.post("/login").send({
        email: "testuser@example.com",
        password: "password123",
      });
    });

    describe("Getting a user", () => {
      it("should fetch a user by email", async () => {
        // Execute
        const response = await agent.get("/users/testuser@example.com");

        // Assert
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("username", "testuser");
        expect(response.body).to.have.property("email", "testuser@example.com");
      });

      it("should return error if user is not found", async () => {
        // Execute
        const response = await agent.get("/users/nouser@example.com");

        // Assert
        expect(response.status).to.equal(404);
      });
    });

    describe("Updating a user", () => {
      it("should update an existing user", async () => {
        //Execute
        const response = await agent.put("/users/testuser@example.com").send({
          username: "testuser",
          password: "password123",
          email: "testuser@example.com",
          address: "123 Fake St",
        });

        // Assert
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("username", "testuser");
        expect(response.body).to.have.property("email", "testuser@example.com");
        expect(response.body).to.have.property("address", "123 Fake St");
      });

      it("should return error if user is not found", async () => {
        // Execute
        const response = await agent.put("/users").send({
          username: "testuser",
          password: "password123",
          email: "nouser@example.com",
          address: "123 Fake St",
        });

        // Assert
        expect(response.status).to.equal(404);
      });
    });

    describe("Deleting a user", () => {
      it("should delete an existing user by email", async () => {
        //Execute
        const response = await agent.delete("/users/testuser@example.com");

        // Assert
        expect(response.status).to.equal(200);
      });
    });
  });
});
