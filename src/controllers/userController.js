const bcrypt = require("bcrypt");
const {
  createUser,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
} = require("../models/userModel");

const addUser = async (req, res) => {
  try {
    const { username, password, email, address } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await createUser(username, hashedPassword, email, address);
    res.status(201).json(newUser);
  } catch (err) {
    if (err.message === "User already exists") {
      return res.status(409).send("User already exists");
    }
    res.status(500).send("Server Error");
  }
};

const getUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, password, email, address } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatedUser = await updateUserByEmail(email, {
      username,
      password: hashedPassword,
      address,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const email = req.params.email;
    const deletedUser = await deleteUserByEmail(email);

    if (!deleteUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
};
