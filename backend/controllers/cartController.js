const Cart = require("../models/cartModel.js");
const Product = require("../models/Product.js");


exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;   
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID missing" });
    }

    const qtyToAdd = quantity ? Number(quantity) : 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity: qtyToAdd }],
      });
    } else {
      
      const existingIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += qtyToAdd;
      } else {
        cart.items.push({ product: productId, quantity: qtyToAdd });
      }
    }

    await cart.save();
    res.json({ message: "Added to cart", cart });

  } catch (error) {
    console.log("ADD TO CART ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;   

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const userId = req.user.userId;   
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json({ message: "Item removed", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
