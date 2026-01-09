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
  // Use a relative path or dynamic host for production
  const host = req.get('host');
  const protocol = req.protocol;
  res.json({
    success: 1,
    image_url: `${protocol}://${host}/images/${req.file.filename}`
  });
});

router.post("/bulk-upload", isAdmin, upload.single('file'), bulkUpload);

module.exports = router;