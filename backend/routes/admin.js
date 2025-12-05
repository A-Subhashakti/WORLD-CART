
const express = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");

const router = express.Router();


function adminOnly(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


router.post("/products", adminOnly, async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      imageUrl,
      category: "menswear",
    });

    res.json({ message: "Product created", product });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/products", adminOnly, async (req, res) => {
  try {
    const products = await Product.find({ category: "menswear" }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Admin products error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
