const {
  createOrder,
  getOrdersByUserId,
  getOrderItemsById,
} = require("../models/orderModel");

const createOrderController = async (req, res) => {
  try {
    const { user_id, payment_method_id, order_date, total_amount, orderItems } =
      req.body;

    // orderItems should be an array of { product_id, quantity, unit_price }
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const newOrder = await createOrder(
      user_id,
      payment_method_id,
      order_date,
      total_amount,
      orderItems
    );

    if (!newOrder) {
      return res.status(400).json({ message: "Order could not be created" });
    }
    res
      .status(201)
      .location(`/orders/${newOrder.order_id}`)
      .json({ message: "Order created successfully", data: newOrder });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

const getOrdersByUserIdController = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const orders = await getOrdersByUserId(user_id);
    if (!orders) {
      return res.status(404).send("Orders not found");
    }
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const getOrderItemsByIdController = async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const orderItems = await getOrderItemsById(order_id);
    if (orderItems.length === 0) {
      return res.status(404).send("Order items not found");
    }
    res.status(200).json(orderItems);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createOrderController,
  getOrdersByUserIdController,
  getOrderItemsByIdController,
};
