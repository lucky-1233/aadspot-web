const express = require('express');
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/overview', async (req, res) => {
  const [users, sellers, stores, products, orders, orderSummary] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'seller' }),
    Store.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{
      $group: {
        _id: null,
        revenue: { $sum: '$total' },
        pending: {
          $sum: {
            $cond: [{ $in: ['$orderStatus', ['pending', 'confirmed', 'processing']] }, 1, 0],
          },
        },
      },
    }]),
  ]);
  res.json({ users, sellers, stores, products, orders, revenue: orderSummary[0]?.revenue || 0, pendingOrders: orderSummary[0]?.pending || 0 });
});

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.patch('/users/:id', async (req, res) => {
  const allowed = ['name', 'email', 'role', 'isActive'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  if (updates.role && !['customer', 'seller', 'admin'].includes(updates.role)) return res.status(400).json({ message: 'Invalid user role.' });
  if (updates.isActive !== undefined && typeof updates.isActive !== 'boolean') return res.status(400).json({ message: 'isActive must be a boolean.' });
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(user);
});

router.get('/sellers', async (req, res) => {
  const sellers = await User.find({ role: 'seller' }).select('-password');
  const stores = await Store.find({ owner: { $in: sellers.map((seller) => seller._id) } });
  const storeByOwner = new Map(stores.map((store) => [String(store.owner), store]));
  const results = await Promise.all(sellers.map(async (seller) => ({
    ...seller.toObject(),
    store: storeByOwner.get(String(seller._id)) || null,
    productCount: await Product.countDocuments({ seller: seller._id }),
  })));
  res.json(results);
});

router.get('/products', async (req, res) => {
  const products = await Product.find().populate('seller', 'name email').populate('store', 'name slug').sort({ createdAt: -1 });
  res.json(products);
});

router.patch('/products/:id', async (req, res) => {
  const updates = {};
  if (req.body.status !== undefined) {
    if (!['active', 'draft', 'archived'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid product status.' });
    updates.status = req.body.status;
  }
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('seller', 'name').populate('store', 'name');
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json(product);
});

router.delete('/products/:id', async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json({ message: 'Product deleted.' });
});

router.get('/orders', async (req, res) => {
  const orders = await Order.find().populate('user', 'name email phone').populate({
    path: 'items.product',
    select: 'name seller store',
    populate: [{ path: 'seller', select: 'name' }, { path: 'store', select: 'name' }],
  }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
