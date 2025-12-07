const Cart = require("../models/cartModel.js");
const Product = require("../models/Product.js");


exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }) ||
                 await Cart.create({ user: req.user.id, items: [] });

    const existing = cart.items.find(i => i.product.toString() === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({ message: "Added", cart });

  } catch (err) {
    console.error("ADD ERROR:", err);
    res.status(500).json({ message: "Error adding to cart" });
  }
};


exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");  
    if (!cart) return res.json({ items: [] });

    res.json(cart);
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;   
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (it) => it.product.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = Number(quantity);

    await cart.save();
    res.json({ message: "Quantity updated", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    ).populate("items.product");

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(updatedCart);
  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.json({ message: "Cart empty" });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) item.quantity = quantity;

    await cart.save();
    res.json({ message: "Updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating cart" });
  }
};
exports.removeItem = async (req, res) => {
  try {
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.json({ message: "Cart empty" });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);

    await cart.save();
    res.json({ message: "Removed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing cart item" });
  }
};

