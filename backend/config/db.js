const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Priority: environment variable from Render/Local .env, then local fallback
    const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shoppingcart";
    
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = connectDB;