const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const auth = require("../middleware/auth");


router.post("/create", auth, async (req, res) => {
  try {
    const { fullname, phone, address, items, totalAmount } = req.body;

    if (!fullname || !phone || !address || !items.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await Order.create({
      user: req.user.id,
      fullname,
      phone,
      address,
      items,
      totalAmount,
    });

    console.log("ORDER CREATED:", order);

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
});


router.get("/my", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("items.product");
  console.log("FETCH ORDERS FOR USER:", req.user.id, orders.length);
  res.json(orders);
});

module.exports = router;
