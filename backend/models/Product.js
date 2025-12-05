
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: "menswear" }, 
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
