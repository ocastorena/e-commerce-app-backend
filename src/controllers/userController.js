const passport = require("passport");
const bcrypt = require("bcrypt");
const {
  createUser,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
  getUserCartById,
  getUserOrdersById,
  getUserPaymentMethodsById,
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
    const existingEmail = req.params.email;
    const { username, password, email, address } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatedUser = await updateUserByEmail(existingEmail, {
      username,
      password: hashedPassword,
      email,
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

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const loginUser = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: "Logged in successfully" });
    });
  })(req, res, next);
};

const logoutUser = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Server Error");
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};

const getUserCartByIdController = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const cart = await getUserCartById(user_id);
    if (!cart) {
      return res.status(404).send("Cart not found");
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const getUserOrdersByIdController = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const orders = await getUserOrdersById(user_id);
    if (!orders) {
      return res.status(404).send("Orders not found");
    }
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const getUserPaymentMethodsByIdController = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const paymentMethod = await getUserPaymentMethodsById(user_id);
    if (!paymentMethod) {
      return res.status(404).send("Payment method not found");
    }
    res.status(200).json(paymentMethod);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  getUserCartByIdController,
  getUserOrdersByIdController,
  getUserPaymentMethodsByIdController,
};
