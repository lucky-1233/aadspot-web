const express = require('express');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const populatedProduct = (query) => query.populate('seller', 'name').populate('store', 'name slug');

router.get('/', async (req, res) => {
  const products = await populatedProduct(Product.find({ status: 'active', stock: { $gt: 0 } }));
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await populatedProduct(Product.findById(req.params.id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

router.get('/seller/mine', protect, authorize('seller'), async (req, res) => {
  const products = await populatedProduct(Product.find({ seller: req.user._id })).sort({ createdAt: -1 });
  res.json(products);
});

router.post('/', protect, authorize('seller'), async (req, res) => {
  const store = await require('../models/Store').findOne({ owner: req.user._id });
  if (!store) return res.status(400).json({ message: 'Create your store before adding products.' });
  const { name, description, price, category, stock } = req.body;
  if (!String(name || '').trim() || !String(description || '').trim() || !String(category || '').trim() ||
      !Number.isFinite(Number(price)) || Number(price) <= 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
    return res.status(400).json({ message: 'Product name, description, category, a positive price, and valid stock are required.' });
  }
  const product = await Product.create({
    name: String(name).trim(),
    description: String(description).trim(),
    price: Number(price),
    discountPrice: Number(req.body.discountPrice) > 0 ? Number(req.body.discountPrice) : undefined,
    category: String(category).trim(),
    stock: Number(stock),
    sku: req.body.sku,
    images: req.body.images || (req.body.image ? [req.body.image] : []),
    status: req.body.status === 'draft' ? 'draft' : 'active',
    store: store._id,
    seller: req.user._id,
  });

  res.status(201).json(await populatedProduct(Product.findById(product._id)));
});

router.put('/:id', protect, authorize('seller'), async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (String(product.seller) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not allowed to update this product' });
  }

  const allowed = ['name', 'description', 'price', 'discountPrice', 'category', 'stock', 'sku', 'images', 'status'];
  for (const field of allowed) {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  }
  if (req.body.image !== undefined && req.body.images === undefined) product.images = req.body.image ? [req.body.image] : [];
  if (!['active', 'draft', 'archived'].includes(product.status)) product.status = 'active';
  await product.save();

  res.json(await populatedProduct(Product.findById(product._id)));
});

router.delete('/:id', protect, authorize('seller'), async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (String(product.seller) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not allowed to delete this product' });
  }

  await Product.deleteOne({ _id: product._id });
  res.json({ message: 'Product deleted' });
});

module.exports = router;
