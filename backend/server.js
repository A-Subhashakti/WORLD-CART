const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config();


const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");
const cartRoutes = require("./routes/cart");
  
const authMiddleware = require("./middleware/auth");

const app = express();


app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Menswear e-commerce backend running ✅");
});




app.use("/api/auth", authRoutes);


app.use("/api/products", productRoutes);


app.use("/api/admin", adminRoutes);


app.use("/api/cart", authMiddleware, cartRoutes);

const PORT = process.env.PORT || 5000;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
});
