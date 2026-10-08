const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

router.patch('/me', protect, async (req, res) => {
  const allowed = ['name', 'phone', 'address', 'city', 'country', 'province', 'district', 'sector'];
  for (const field of allowed) {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  }
  await req.user.save();
  res.json({ user: req.user });
});

router.patch('/me/password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Current password and a new password of at least 6 characters are required.' });
  }
  const user = await User.findById(req.user._id).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ message: 'Current password is incorrect.' });
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated successfully.' });
});

router.get('/me/cart', protect, authorize('customer'), async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  res.json({ cart: user.cart.filter((item) => item.product).map((item) => ({ productId: item.product._id, quantity: item.quantity })) });
});

router.put('/me/cart', protect, authorize('customer'), async (req, res) => {
  const Product = require('../models/Product');
  if (!Array.isArray(req.body.items)) return res.status(400).json({ message: 'Cart items must be an array.' });
  const items = [];
  for (const item of req.body.items) {
    if (!item.productId || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) {
      return res.status(400).json({ message: 'Each cart item must include a product and a positive integer quantity.' });
    }
    const product = await Product.findOne({ _id: item.productId, status: 'active' });
    if (!product) return res.status(400).json({ message: 'A cart product is unavailable.' });
    if (Number(item.quantity) > product.stock) return res.status(400).json({ message: `Not enough stock for ${product.name}.` });
    items.push({ product: product._id, quantity: Number(item.quantity) });
  }
  await User.updateOne({ _id: req.user._id }, { $set: { cart: items } });
  res.json({ cart: req.body.items });
});

router.get('/', protect, authorize('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
