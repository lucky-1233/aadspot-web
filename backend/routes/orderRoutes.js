const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { protect, authorize } = require('../middleware/auth');
const paymentService = require('../services/paymentService');

const router = express.Router();
const populated = (query) => query.populate('user', 'name email phone').populate({
  path: 'items.product',
  select: 'name seller store images',
  populate: [{ path: 'seller', select: 'name' }, { path: 'store', select: 'name' }],
});

router.get('/seller', protect, authorize('seller'), async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).select('_id');
  const orders = await populated(Order.find({ 'items.product': { $in: products.map((item) => item._id) } }).sort({ createdAt: -1 }));
  res.json(orders);
});

router.get('/', protect, async (req, res) => {
  if (req.user.role === 'admin') return res.status(403).json({ message: 'Use the admin orders endpoint.' });
  const orders = req.user.role === 'seller'
    ? await populated(Order.find({ 'items.product': { $in: await Product.find({ seller: req.user._id }).distinct('_id') } }).sort({ createdAt: -1 }))
    : await populated(Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
  res.json(orders);
});

router.post('/', protect, authorize('customer'), async (req, res) => {
  const { items, deliveryAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must include items.' });
  }

  let subtotal = 0;
  const orderItems = [];
  const quantities = new Map();

  for (const item of items) {
    if (!item.product || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) {
      return res.status(400).json({ message: 'Each order item must include a product and positive integer quantity.' });
    }
    const product = await Product.findOne({ _id: item.product, status: 'active' });
    if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
    const quantity = (quantities.get(String(product._id)) || 0) + Number(item.quantity);
    quantities.set(String(product._id), quantity);
    if (quantity > product.stock) {
      return res.status(400).json({ message: `Not enough stock for ${product.name}` });
    }

    const price = product.discountPrice || product.price;
    subtotal += price * Number(item.quantity);
    orderItems.push({ product: product._id, name: product.name, quantity: Number(item.quantity), price });
  }

  if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.district || !deliveryAddress.sector || !deliveryAddress.details) {
    return res.status(400).json({ message: 'Complete your delivery address before placing the order.' });
  }
  const deliveryFee = subtotal > 0 ? 3500 : 0;
  const total = subtotal + deliveryFee;

  const payment = await paymentService.createPaymentIntent({ amount: total });
  const changed = [];
  try {
    for (const [productId, quantity] of quantities) {
      const product = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity }, status: 'active' },
        { $inc: { stock: -quantity } },
        { new: true }
      );
      if (!product) throw Object.assign(new Error('A product no longer has enough stock.'), { status: 409 });
      changed.push([productId, quantity]);
    }
    const order = await Order.create({
      orderNumber: `AD-${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}-${Math.random().toString(36).slice(2, 7)}`,
      user: req.user._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      paymentProvider: payment.provider,
      paymentRef: payment.reference,
      paymentStatus: 'pending',
    });
    await require('../models/User').updateOne({ _id: req.user._id }, { $set: { cart: [] } });
    res.status(201).json(await populated(Order.findById(order._id)));
  } catch (error) {
    await Promise.all(changed.map(([productId, quantity]) => Product.updateOne({ _id: productId }, { $inc: { stock: quantity } })));
    if (error.status) return res.status(error.status).json({ message: error.message });
    throw error;
  }
});

router.patch('/:id/status', protect, authorize('seller', 'admin'), async (req, res) => {
  const status = String(req.body.status || '').toLowerCase();
  const allowed = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'A valid order status is required.' });
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (req.user.role === 'seller') {
    const store = await Store.findOne({ owner: req.user._id }).select('_id');
    const ownedProducts = await Product.find({ seller: req.user._id }).distinct('_id');
    if (!store || !order.items.some((item) => ownedProducts.some((productId) => String(productId) === String(item.product)))) {
      return res.status(403).json({ message: 'You cannot update an order belonging to another seller.' });
    }
  }

  order.orderStatus = status;
  await order.save();

  res.json(await populated(Order.findById(order._id)));
});

module.exports = router;
