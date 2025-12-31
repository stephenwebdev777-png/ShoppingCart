const User = require('../model/User');
const Product = require('../model/Product');

const validateCartKey = async (key) => {
   
    const parts = key.split('_');
    if (parts.length !== 2 || !parts[1]) {
        return { valid: false, message: "Invalid format. Use productId_size" };
    }

    const [productId, size] = parts;

    // 2. Check Size: Must be one of the allowed sizes
    const allowedSizes = ['S', 'M', 'L', 'XL', 'XXL'];
    if (!allowedSizes.includes(size.toUpperCase())) {
        return { valid: false, message: `Invalid size. Allowed sizes: ${allowedSizes.join(', ')}` };
    }

    // 3. Check Product Existence: Verify ID in database
    const productExists = await Product.findOne({ id: Number(productId) });
    if (!productExists) {
        return { valid: false, message: `Product ID ${productId} is not available` };
    }

    return { valid: true };
};

// Add to Cart
exports.addToCart = async (req, res) => {
    try {
        const { itemId } = req.body;

        const validation = await validateCartKey(itemId);
        if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.message });
        }

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        let cartData = Array.isArray(user.cartData) ? user.cartData : [];
        const itemIndex = cartData.findIndex(item => item.key === itemId);

        if (itemIndex > -1) {
            cartData[itemIndex].quantity += 1;
        } else {
            cartData.push({ key: itemId, quantity: 1 });
        }

        user.cartData = cartData;
        user.markModified('cartData');
        await user.save();

        res.json({ success: true, message: "Added to Cart" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error adding to cart" });
    }
};

// Update Cart (Merging and Validation)
exports.updateCart = async (req, res) => {
    try {
        const updates = req.body; // Expecting { "102_S": 6, "101_M": 5 }

        // Validate all keys in the updates object first
        for (const key in updates) {
            const validation = await validateCartKey(key);
            if (!validation.valid) {
                return res.status(400).json({ success: false, message: validation.message });
            }
        }

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        let cartData = Array.isArray(user.cartData) ? user.cartData : [];

        for (const key in updates) {
            const newQuantity = updates[key];
            const itemIndex = cartData.findIndex(item => item.key === key);

            if (itemIndex > -1) {
                cartData[itemIndex].quantity = newQuantity;
            } else {
                cartData.push({ key: key, quantity: newQuantity });
            }
        }

        // Clean up: Remove items with 0 quantity
        user.cartData = cartData.filter(item => item.quantity > 0);
        user.markModified('cartData');
        await user.save();

        res.json({ success: true, message: "Cart Updated Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to update cart" });
    }
};

// Reduce Quantity from Cart
exports.removeFromCart = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        let cartData = Array.isArray(user.cartData) ? user.cartData : [];
        const { itemId } = req.body;

        const itemIndex = cartData.findIndex(item => item.key === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Product not found in your cart" });
        }

        if (cartData[itemIndex].quantity > 1) {
            cartData[itemIndex].quantity -= 1;
        } else {
            cartData.splice(itemIndex, 1);
        }

        user.cartData = cartData;
        user.markModified('cartData');
        await user.save();

        res.json({ success: true, message: 'Reduced Quantity from Cart' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Remove entire item entry
exports.removeEntireItem = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        let cartData = Array.isArray(user.cartData) ? user.cartData : [];
        const { itemId } = req.body;

        const itemExists = cartData.some(item => item.key === itemId);
        if (!itemExists) {
            return res.status(404).json({ success: false, message: "Product not found in your cart" });
        }

        user.cartData = cartData.filter(item => item.key !== itemId);
        user.markModified('cartData');
        await user.save();

        res.json({ success: true, message: "Product fully removed from cart" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error removing item" });
    }
};

// Get Cart
exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json(Array.isArray(user.cartData) ? user.cartData : []);
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch cart" });
    }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, username: user.username, email: user.email });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch user data' });
    }
};