const Order = require("../models/orders");
const Cart = require("../models/cartModel");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

   
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

   
    const order = await Order.create({
      user: userId,
      items: cart.items,
      total,
      status: "Completed",
    });

    
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    console.log("ORDER CREATED:", order._id);

    return res.status(201).json({ message: "Order placed!", order });

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return res.status(500).json({ message: err.message });
  }



};  

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    console.log("FETCH ORDERS FOR USER:", userId, orders.length);

    return res.json(orders);

  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

