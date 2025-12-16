const Product = require("../model/Product.js");

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add Product (Admin only)
const addProduct = async (req, res) => {
  try {
    let lastProduct = await Product.findOne().sort({ id: -1 });
    let id = lastProduct ? lastProduct.id + 1 : 1;
    const { name, image, category, new_price, old_price } = req.body;

    const product = new Product({ id, name, image, category, new_price, old_price });
    await product.save();

    res.json({ success: true, name });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get New Collections (Last 8 Products)
const getNewCollections = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ date: -1 }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Popular Products in Women Category
const getPopularInWomen = async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });
    const popularInWomen = products.sort(() => 0.5 - Math.random()).slice(0, 4);
    res.json(popularInWomen);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllProducts, addProduct, getNewCollections, getPopularInWomen };
