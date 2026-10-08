const express = require('express');
const Store = require('../models/Store');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const stores = await Store.find({ isActive: true }).populate('owner', 'name email');
  res.json(stores);
});

router.get('/mine', protect, authorize('seller'), async (req, res) => {
  const store = await Store.findOne({ owner: req.user._id });
  res.json(store);
});

router.post('/', protect, authorize('seller'), async (req, res) => {
  const existing = await Store.findOne({ owner: req.user._id });
  if (existing) return res.status(409).json({ message: 'Your account already has a store. Update the existing store instead.' });
  const name = String(req.body.name || '').trim();
  const description = String(req.body.description || '').trim();
  if (!name || !description) return res.status(400).json({ message: 'Store name and description are required.' });
  const slug = String(req.body.slug || name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const store = await Store.create({
    name,
    description,
    slug,
    logo: req.body.logo,
    banner: req.body.banner,
    category: req.body.category,
    location: req.body.location,
    contactPhone: req.body.contactPhone,
    email: req.body.email,
    owner: req.user._id,
  });

  res.status(201).json(store);
});

router.put('/:id', protect, authorize('seller'), async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id, owner: req.user._id });
  if (!store) return res.status(404).json({ message: 'Store not found.' });
  const allowed = ['name', 'description', 'logo', 'banner', 'category', 'location', 'contactPhone', 'email'];
  for (const field of allowed) {
    if (req.body[field] !== undefined) store[field] = req.body[field];
  }
  if (req.body.name !== undefined) {
    store.slug = String(req.body.name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  await store.save();
  res.json(store);
});

module.exports = router;
