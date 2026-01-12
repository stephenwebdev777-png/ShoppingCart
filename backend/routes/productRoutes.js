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
  let backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
  if (backendUrl.includes("onrender.com")) {
    backendUrl = backendUrl.replace("http://", "https://");
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
            if (product.image && product.image.startsWith("http://")) {
                product.image = product.image.replace("http://", "https://");
                await product.save();
                updatedCount++;
            }
        }
        res.json({ success: true, message: `Updated ${updatedCount} products to HTTPS.` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
module.exports = router;