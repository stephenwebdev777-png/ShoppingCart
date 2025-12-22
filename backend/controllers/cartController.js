const User = require('../model/User');

exports.addToCart = async (req, res) => {
  try {
  
    let user = await User.findById(req.user.id);
    if (!user) 
      return res.status(404).json({ success: false, message: "User not found" });

    let cartData = Array.isArray(user.cartData) ? user.cartData : [];
    const { itemId } = req.body; 
    const itemIndex = cartData.findIndex(item => item.key === itemId);

    if (itemIndex > -1) {
      cartData[itemIndex].quantity += 1;
    } else {
      cartData.push({ key: itemId, quantity: 1 });
    }

    user.cartData = cartData;
    user.markModified('cartData');  //field has been changed manually.(markmodified)
    await user.save();

    res.json({ success: true, message: "Added to Cart" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    let cartData = Array.isArray(user.cartData) ? user.cartData : [];
    const { itemId } = req.body;

    const itemIndex = cartData.findIndex(item => item.key === itemId);

    if (itemIndex > -1) {
      if (cartData[itemIndex].quantity > 1) {
        cartData[itemIndex].quantity -= 1;
      } else {
        cartData.splice(itemIndex, 1);
      }
      user.cartData = cartData;  //cartdata nested array 
      user.markModified('cartData');  //field has been changed manually by markmodified
      await user.save();
    }
    res.json({ success: true, message: 'Removed from Cart' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Cart 
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json(Array.isArray(user.cartData) ? user.cartData : []);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch cart" });
  }
};

// Update Cart 
exports.updateCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cartData: req.body });
    res.json({ success: true, message: 'Cart Updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update cart' });
  }
};

// Get User Info for Checkout
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    res.json({ 
      success: true, 
      username: user.username, 
      email: user.email 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user data' });
  }
};