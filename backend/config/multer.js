const multer = require("multer");
const path = require("path");
const uploadDir = './upload/images';
const fs = require("fs");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const Product = require("../model/Product");

// Storage configuration for images
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

//bulk uploads
const bulkUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const filePath = req.file.path;
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        let products = [];

        if (fileExtension === '.csv') {
            // Process CSV
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => products.push(data))
                .on('end', async () => {
                    await saveToDatabase(products, res, filePath);
                });
        } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            products = xlsx.utils.sheet_to_json(sheet);
            await saveToDatabase(products, res, filePath);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const saveToDatabase = async (products, res, filePath) => {
  try {
    const lastProduct = await Product.findOne().sort({ id: -1 });
    let currentId = lastProduct ? lastProduct.id + 1 : 100;

    // Get the live URL from Render environment variables
    let BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
    if (BACKEND_URL.endsWith("/")) BACKEND_URL = BACKEND_URL.slice(0, -1);

    const formattedProducts = [];

    for (let item of products) {
      if (!item.name || !item.category || item.new_price === undefined) continue;

      let imageField = item.image ? String(item.image).trim() : "";
      let finalImageUrl = "";

      if (imageField) {
        if (imageField.includes("localhost:3000")) {
          // Fix: If Excel still has localhost, swap it for the live Render URL
          finalImageUrl = imageField.replace("http://localhost:3000", BACKEND_URL);
        } else if (imageField.startsWith("http")) {
          // Keep existing external HTTPS links as they are
          finalImageUrl = imageField;
        } else {
          // Standard: Combine Render URL + /images/ + filename from Excel
          const fileName = imageField.replace(/^\/+/, "");
          finalImageUrl = `${BACKEND_URL}/images/${fileName}`;
        }
      }

      formattedProducts.push({
        id: currentId++,
        name: item.name.trim(),
        image: finalImageUrl,
        category: item.category.toLowerCase().trim(),
        new_price: Number(item.new_price),
        old_price: Number(item.old_price) || 0,
        date: Date.now(),
        available: true,
      });
    }

    await Product.insertMany(formattedProducts);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ success: true, message: `Successfully added ${formattedProducts.length} items.` });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ success: false, message: "Error saving to database: " + err.message });
  }
};
module.exports = { bulkUpload, upload };