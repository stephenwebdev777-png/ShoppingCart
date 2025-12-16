require("dotenv").config();  // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

// Middleware
const fetchUser = require("./middleware/fetchUser");  // Make sure this is properly handling authentication
const { isAdmin } = require("./middleware/isAdmin");  // For admin-specific routes

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shoppingcart";

// Middleware Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Adjust the frontend URL as needed
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());  // Parse JSON request bodies

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/auth", authRoutes);  // Authentication routes
app.use("/product", productRoutes);  // Product-related routes
app.use("/cart", fetchUser, userRoutes);  // Cart routes (ensure user is fetched before proceeding)

// Error Handling (Basic error handler)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
