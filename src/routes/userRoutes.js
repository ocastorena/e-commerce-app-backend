const express = require("express");
const router = express.Router();
const {
  addUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.post("/users", addUser);
router.get("/users/:email", getUser);
router.put("/users", updateUser);
router.delete("/users/:email", deleteUser);

module.exports = router;
