const express = require("express");
const {
  getAllProducts,
  addProduct,
  removeProduct,
  getProductById,
  getNewCollections,
  getPopularInWomen,
} = require("../controllers/productController");

const upload = require("../config/multer");
const isAdmin = require("../middleware/isAdmin");
// const fetchUser = require("../middleware/fetchUser"); 

const router = express.Router();

router.get("/newcollections", getNewCollections);
router.get("/popularinwomen", getPopularInWomen);
router.get("/allproduct", getAllProducts);

router.get("/product/:id",getProductById);

router.post("/addproduct", isAdmin, addProduct);
router.post("/removeproduct", isAdmin, removeProduct);

router.post("/upload", isAdmin,upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:3000/images/${req.file.filename}`
  });
});

module.exports = router;