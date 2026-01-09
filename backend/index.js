require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(express.json());

// Dynamic CORS configuration
app.use(cors({
  origin: [
    "https://shopping-cart-xi-five-81.vercel.app", 
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "auth-token", "Accept"]
}));

// Database Connection 
connectDB();

// Static Folder for Images 
app.use("/images", express.static(path.join(__dirname, "upload/images")));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/user", require("./routes/userRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));