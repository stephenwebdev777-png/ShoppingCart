const Users = require('../models/User');

// Add to Cart
exports.addToCart = async (req, res) => {
  let user = await Users.findOne({ email: req.user });
  const itemId = req.body.itemId;
  if (!user.cartData) {
    user.cartData = {};
  }
  if (!user.cartData[itemId]) {
    user.cartData[itemId] = 0;
  }
  user.cartData[itemId] += 1;

  await Users.findOneAndUpdate({ email: req.user }, { cartData: user.cartData });
  res.json({ success: true, message: "Added to Cart" });
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.user });
    const itemId = req.body.itemId;
    if (user.cartData[itemId] > 0) {
      user.cartData[itemId] -= 1;
      await Users.findOneAndUpdate({ email: req.user }, { cartData: user.cartData });
    }
    res.json({ success: true, message: 'Removed from Cart', cartData: user.cartData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.user });
    res.json(user.cartData);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch cart" });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user });
    user.cartData = req.body; // Update cart with the new data from request body
    await user.save();
    res.json({ success: true, message: 'Cart Updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update cart' });
  }
};

// Get User Info (for delivery stage)
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    res.json({ success: true, username: user.username });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user data' });
  }
};
