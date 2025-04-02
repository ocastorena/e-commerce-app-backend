const express = require("express");
const router = express.Router();
const checkAuthentication = require("../middleware/authMiddleware");
const {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  getUserCartByIdController,
  getUserOrdersByIdController,
  getUserPaymentMethodsByIdController,
} = require("../controllers/userController");

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: yourSecurePassword
 *               address:
 *                 type: string
 *                 example: "123 Main St, Anytown, USA"
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid input.
 */
router.post("/users", checkAuthentication, addUser);
/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Retrieve a specific user by email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the user.
 *     responses:
 *       '200':
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found.
 */
router.get("/users/:email", checkAuthentication, getUser);
/**
 * @swagger
 * /users/{email}:
 *   put:
 *     summary: Update an existing user by email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               address:
 *                 type: string
 *             example:
 *               username: johndoe
 *               email: johndoe@example.com
 *               password: newSecurePassword
 *               address: "456 New Address, Anytown, USA"
 *     responses:
 *       '200':
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid input.
 *       '404':
 *         description: User not found.
 */
router.put("/users/:email", checkAuthentication, updateUser);
/**
 * @swagger
 * /users/{email}:
 *   delete:
 *     summary: Delete a user by email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the user to delete.
 *     responses:
 *       '204':
 *         description: User deleted successfully. No content returned.
 *       '404':
 *         description: User not found.
 */
router.delete("/users/:email", checkAuthentication, deleteUser);
/**
 * @swagger
 * /users/{user_id}/cart:
 *   get:
 *     summary: Retrieve the current cart for a user.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: Cart details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.get(
  "/users/:user_id/cart",
  checkAuthentication,
  getUserCartByIdController
);
/**
 * @swagger
 * /users/{user_id}/orders:
 *   get:
 *     summary: Retrieve orders placed by a user.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: A list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get(
  "/users/:user_id/orders",
  checkAuthentication,
  getUserOrdersByIdController
);
/**
 * @swagger
 * /users/{user_id}/payment-methods:
 *   get:
 *     summary: Retrieve a user's payment methods.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: A list of payment methods.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethod'
 */
router.get(
  "/users/:user_id/payment-methods",
  checkAuthentication,
  getUserPaymentMethodsByIdController
);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in as user.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: yourSecurePassword
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid input.
 */
router.post("/login", loginUser);
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out as user.
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: User logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethod'
 */
router.get("/logout", checkAuthentication, logoutUser);

module.exports = router;
