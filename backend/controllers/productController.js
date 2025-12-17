const Product = require("../model/Product");

const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

const addProduct = async (req, res) => {
  try {
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 100;

    const product = new Product({
      id: newId,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: Number(req.body.new_price),
      old_price: Number(req.body.old_price),
    });

    await product.save();
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Validation Failed" });
  }
};

const removeProduct = async (req, res) => {
  
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, message: "Product Removed" });
};

const getProductById = async (req, res) => {
  try {   
    const product = await Product.findOne({ id: Number(req.params.id) });    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getNewCollections = async (req, res) => {
  const products = await Product.find({ category: "men" }).sort({ date:-1 }).limit(8);
  res.json(products);
};

const getPopularInWomen = async (req, res) => {
  const products = await Product.find({ category: "women" }).limit(4);
  res.json(products);
};

module.exports = {
  getAllProducts,
  addProduct,
  removeProduct, 
  getProductById,
  getNewCollections,
  getPopularInWomen,
};
