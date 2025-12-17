const User = require('../model/User'); // 

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user }); // 
    let cartData = user.cartData || {}; // 

    const itemId = req.body.itemId; // 
    cartData[itemId] = (cartData[itemId] || 0) + 1; // 

    await User.findOneAndUpdate({ email: req.user }, { cartData }); // 
    res.json({ success: true, message: "Added to Cart" }); // 
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding to cart" }); // 
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user }); // 
    const itemId = req.body.itemId; // 
    if (user.cartData[itemId] > 0) { // 
      user.cartData[itemId] -= 1; // 
      await User.findOneAndUpdate({ email: req.user }, { cartData: user.cartData }); // 
    }
    res.json({ success: true, message: 'Removed from Cart', cartData: user.cartData }); // 
  } catch (err) {
    res.status(500).json({ success: false, error: err.message }); // 
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user }); // 
    res.json(user.cartData || {}); // 
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch cart" }); // 
  }
};

// Update Cart
exports.updateCart = async (req, res) => {
  try {
    await User.findOneAndUpdate({ email: req.user }, { cartData: req.body }); // 
    res.json({ success: true, message: 'Cart Updated' }); // 
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update cart' }); // 
  }
};

// Get User Info (for delivery stage)
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user }); // 
    if (!user) return res.status(404).json({ success: false, error: 'User not found' }); // 

    res.json({ success: true, username: user.username }); // 
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user data' }); // 
  }
};

// NEW: Clear Cart after successful order
exports.clearCart = async (req, res) => {
  try {
    await User.findOneAndUpdate({ email: req.user }, { cartData: {} }); //
    res.json({ success: true, message: "Cart Cleared" }); //
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to clear cart" }); //
  }
};