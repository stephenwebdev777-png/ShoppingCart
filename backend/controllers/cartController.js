const User = require('../model/User'); // 

// Add to Cart

// Add to Cart: Preserves addition order by pushing to array end
exports.addToCart = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user });
    let cartData = Array.isArray(user.cartData) ? user.cartData : [];

    const { itemId } = req.body; 
    const itemIndex = cartData.findIndex(item => item.key === itemId);

    if (itemIndex > -1) {
      cartData[itemIndex].quantity += 1;
    } else {
      // NEW ITEM IS ADDED AT THE END, MAINTAINING SEQUENCE
      cartData.push({ key: itemId, quantity: 1 });
    }
    await User.findOneAndUpdate({ email: req.user }, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user });
    let cartData = Array.isArray(user.cartData) ? user.cartData : [];
    const { itemId } = req.body;

    const itemIndex = cartData.findIndex(item => item.key === itemId);

    if (itemIndex > -1) {
      if (cartData[itemIndex].quantity > 1) {
        cartData[itemIndex].quantity -= 1;
      } else {
        // Remove item entirely if quantity reaches zero
        cartData.splice(itemIndex, 1);
      }
      await User.findOneAndUpdate({ email: req.user }, { cartData });
    }
    res.json({ success: true, message: 'Removed from Cart', cartData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user });
    res.json(Array.isArray(user.cartData) ? user.cartData : []);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch cart" });
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

