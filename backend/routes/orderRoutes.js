const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const paymentService = require('../services/paymentService');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.post('/', protect, async (req, res) => {
  const { items, deliveryAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order must include items' });
  }

  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({ message: `Product not found: ${item.product}` });
    }

    if (item.quantity > product.stock) {
      return res.status(400).json({ message: `Not enough stock for ${product.name}` });
    }

    subtotal += product.price * item.quantity;
    product.stock -= item.quantity;
    await product.save();
  }

  const deliveryFee = subtotal > 0 ? 3000 : 0;
  const total = subtotal + deliveryFee;

  const payment = await paymentService.createPaymentIntent({ amount: total });

  const order = await Order.create({
    orderNumber: `AD-${Date.now()}`,
    user: req.user._id,
    items: items.map((item) => ({
      product: item.product,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal,
    deliveryFee,
    total,
    deliveryAddress,
    paymentProvider: payment.provider,
    paymentRef: payment.reference,
    paymentStatus: payment.status === 'pending' ? 'pending' : 'paid',
  });

  res.status(201).json(order);
});

router.patch('/:id/status', protect, authorize('seller', 'admin'), async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.orderStatus = status;
  await order.save();

  res.json(order);
});

module.exports = router;
