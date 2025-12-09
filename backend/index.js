const port=3000
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/shoppingcart");

const uploadDir = './upload/images';
fs.mkdirSync(uploadDir, { recursive: true });

// User Schema
const Users = mongoose.model("Users", {
  username: String,
  email: String,
  password: String,
  role: String, 
  cartData: Object,
});

// Product Schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now }, //  to track recent products
  available: { type: Boolean, default: true },
});


// Middleware (for addtocart,removefromcart)
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.json({ success: false, errors: "Login first" });

  try {
    const data = jwt.verify(token, "secret");
    req.user = data.email;
    req.role = data.role;
    next();
  } catch {
    res.status(401).json({ success: false, errors: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ success: false, errors: "Login first" });
  }

  try {
    const data = jwt.verify(token, "secret");
    if (data.role !== "admin") {
      return res.status(403).json({ success: false, errors: "Admin access only" });
    }
    req.user = data.email;
    req.role = data.role;
    next();
  } catch {
    res.status(401).json({ success: false, errors: "Invalid token" });
  }
};

// Storage for images
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

app.use("/images", express.static("upload/images"));
app.post('/upload', isAdmin,upload.single("product"), (req, res) => {
  res.json
  ({
    success:1,
    image_url:`http://localhost:${port}/images/${req.file.filename}`
  })  
})


// Signup
app.post("/signup", async (req, res) => {
  const check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.json({ success: false, errors: "User already exists" });
  }  

  const user = new Users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role, // Default role for new signups
    cartData: {},
  });

  await user.save();

  const token = jwt.sign({ email: req.body.email }, "secret");
  res.json({ success: true, token, role: user.role });
});

// Login
app.post("/login", async (req, res) => {
  const user = await Users.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (!user) {
    return res.json({ success: false, errors: "Invalid email or password" });
  }
  const token = jwt.sign(
    { email: user.email, role: user.role },
    "secret"
  );
  res.json({
    success: true,
    token:token,
    role: user.role 
  });
});

//logout
app.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
});


// Get All Products
app.get("/allproduct", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Add to Cart
app.post("/addtocart", fetchUser, async (req, res) => {
  let user = await Users.findOne({ email: req.user });

  const itemId = req.body.itemId;
  if (!user.cartData) {
    user.cartData = {};
  }
  // if item not existed set to 0
  if (!user.cartData[itemId]) {
    user.cartData[itemId] = 0;
  }
  user.cartData[itemId] += 1;

  // update database 
  await Users.findOneAndUpdate(
    { email: req.user }, 
    { cartData: user.cartData }
  );
  res.json({ success: true, message: "Added" });
});

// Remove from Cart
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.user });
    const itemId = req.body.itemId;

    if (user.cartData[itemId] > 0) {
      user.cartData[itemId] -= 1;
      await Users.findOneAndUpdate({ email: req.user }, { cartData: user.cartData });
    }
    res.json({ success: true, cartData: user.cartData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add Product
app.post("/addproduct", isAdmin,async (req, res) => {  
  try {
    let lastProduct = await Product.findOne().sort({ id: -1 });  //desc order
    let id = lastProduct ? lastProduct.id + 1 : 1;
  
    
    const product = new Product({
      id:id,
      name: req.body.name,
      image: req.body.image,   // Use image URL from frontend
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();
    res.json({ success: true ,name:req.body.name});
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Remove Product
app.post("/removeproduct", isAdmin, async (req, res) => {
try {
 const deletedProduct = await Product.findByIdAndDelete(req.body.id);
 if (!deletedProduct) { 
  return res.status(404).json({ success: false, message: "Product not found." });
 }
 res.json({ success: true, message: "Product removed successfully" });    
} catch (err) {
   res.status(500).json({ success: false, error: "Deletion failed: " + err.message });}
});

//getcart by user
app.post("/getcart", fetchUser, async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.user });
    res.json(user.cartData);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch cart" });
  }
});

//update cart
app.post("/updatecart", fetchUser, async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.user });
    user.cartData = req.body.cartData;
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

//new collections
app.get("/newcollections", async (req, res) => { 
  let products = await Product.find({});
  let newcollection = products.slice(-8); 
  res.send(newcollection);
});

//popular in women
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });  
  let popular_in_women = products.sort(() => 0.5 - Math.random()).slice(0, 4);  
  res.send(popular_in_women);
});

//proceed to cart username (delivering stage) 
app.post("/getuserinfo", fetchUser, async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.user });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }    
    res.json({ success: true, username: user.username }); 
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch user data" });
  }
});

// Start Server
app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});