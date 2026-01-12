const express = require("express");
const {
  getAllProducts,
  addProduct,
  removeProduct,
  updateProduct,
  getProductById,
  getNewCollections,
  getPopularInWomen,
} = require("../controllers/productController");

const {bulkUpload,upload}= require("../config/multer");
const isAdmin = require("../middleware/isAdmin");
const Product = require("../model/Product");
// const fetchUser = require("../middleware/fetchUser"); 

const router = express.Router();

router.get("/newcollections", getNewCollections);
router.get("/popularinwomen", getPopularInWomen);
router.get("/allproduct", getAllProducts);

router.get("/product/:id",getProductById);

router.post("/addproduct", isAdmin, addProduct);
router.post("/removeproduct", isAdmin, removeProduct);

router.post("/updateproduct", isAdmin, updateProduct);


router.post("/upload", isAdmin, upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }
  let backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
   if (backendUrl.includes("onrender.com")) {
    backendUrl = backendUrl.replace("http://", "https://");
  }
  if (backendUrl.endsWith("/")) {
    backendUrl = backendUrl.slice(0, -1);
  }

  res.json({
    success: 1,
    image_url: `${backendUrl}/images/${req.file.filename}`
  });
});

router.post("/bulk-upload", isAdmin, upload.single('file'), bulkUpload);

router.get("/fix-secure-links", isAdmin, async (req, res) => {
    try {
        const products = await Product.find({});
        let updatedCount = 0;
        for (let product of products) {
            let changed = false;
            
            if (product.image && product.image.startsWith("http://")) {
                product.image = product.image.replace("http://", "https://");
                changed = true;
            }
            
            // Optional: Fix localhost links if they accidentally slipped in
            if (product.image && product.image.includes("localhost:3000")) {
                let backendUrl = process.env.BACKEND_URL || "https://shoppingcart-ias2.onrender.com";
                product.image = product.image.replace("http://localhost:3000", backendUrl);
                changed = true;
            }

            if (changed) {
                await product.save();
                updatedCount++;
            }
        }
        res.json({ success: true, message: `Updated ${updatedCount} products to secure URLs.` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
module.exports = router;