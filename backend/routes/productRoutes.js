const express = require('express');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find({ status: 'active' }).populate('seller', 'name').populate('store', 'name');
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'name').populate('store', 'name');

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

router.post('/', protect, authorize('seller'), async (req, res) => {
  const product = await Product.create({
    ...req.body,
    seller: req.user._id,
  });

  res.status(201).json(product);
});

router.put('/:id', protect, authorize('seller'), async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (String(product.seller) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not allowed to update this product' });
  }

  Object.assign(product, req.body);
  await product.save();

  res.json(product);
});

router.delete('/:id', protect, authorize('seller'), async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (String(product.seller) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not allowed to delete this product' });
  }

  await product.remove();
  res.json({ message: 'Product deleted' });
});

module.exports = router;
