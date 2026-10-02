const express = require('express');
const Store = require('../models/Store');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const stores = await Store.find({ isActive: true }).populate('owner', 'name email');
  res.json(stores);
});

router.post('/', protect, authorize('seller'), async (req, res) => {
  const store = await Store.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json(store);
});

module.exports = router;
