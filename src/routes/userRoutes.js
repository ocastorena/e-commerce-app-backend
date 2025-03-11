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
} = require("../controllers/userController");

router.post("/users", addUser);
router.get("/users/:email", checkAuthentication, getUser);
router.put("/users", checkAuthentication, updateUser);
router.delete("/users/:email", checkAuthentication, deleteUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

module.exports = router;
