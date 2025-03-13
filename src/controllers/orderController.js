const { getOrderById, getOrderItemsById } = require("../models/orderModel");

const getOrderByIdController = async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const order = await getOrderById(order_id);
    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.status(200).json(order);
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
  getOrderByIdController,
  getOrderItemsByIdController,
};
