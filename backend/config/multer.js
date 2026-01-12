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
        //format needs because datas are in string format
        const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
        if (BACKEND_URL.endsWith("/")) {
      BACKEND_URL = BACKEND_URL.slice(0, -1);
    }
        const formattedProducts = [];
        const skippedItems = [];

       for (let item of products) {
      // null values check
      if (!item.name || !item.category || item.new_price === undefined) {
        skippedItems.push(`${item.name || "Unknown"}: Missing Fields`);
        continue;
      }

      // duplicates check by name
      const exists = await Product.findOne({ name: item.name.trim() });
      if (exists) {
        skippedItems.push(`${item.name}: Already exists in Database`);
        continue;
      }
      let finalImageUrl = item.image ? String(item.image).trim() : "";
           if (finalImageUrl) {
        if (!finalImageUrl.startsWith("http")) {
        const fileName = finalImageUrl.replace(/^\/+/, "");
          finalImageUrl = `${BACKEND_URL}/images/${fileName}`;
        }
      } else {
        finalImageUrl = `${BACKEND_URL}/images/default_placeholder.png`;
      }

      formattedProducts.push({
        id: currentId++,
        name: item.name.trim(),
        image: finalImageUrl,
        category: item.category,
        new_price: Number(item.new_price),
        old_price: Number(item.old_price) || 0,
        date: Date.now(),
        available: true,
      });
    }

    if (formattedProducts.length === 0) {
      if (fs.existsSync(filePath)) 
        fs.unlinkSync(filePath);
      return res.status(400).json({ 
        success: false, 
        message: "Valid products were not found. ",
        skippeddetails: skippedItems,
      });
    }

    await Product.insertMany(formattedProducts);
    
    if (fs.existsSync(filePath)) 
        fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: `${formattedProducts.length} added (${skippedItems.length} skipped)`,
      skippeddetails: skippedItems
    });

  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(400).json({ 
      success: false,
      message: "Internal Validation Error" });
  }
};
module.exports = { bulkUpload, upload };