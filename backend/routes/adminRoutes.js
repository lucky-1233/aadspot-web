const express = require('express');
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/overview', async (req, res) => {
  const users = await User.countDocuments();
  const stores = await Store.countDocuments();
  const products = await Product.countDocuments();

  res.json({ users, stores, products });
});

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
