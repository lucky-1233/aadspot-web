require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Store = require('./models/Store');
const Product = require('./models/Product');

const seed = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adspot';
  await mongoose.connect(mongoUri);

  await User.deleteMany({});
  await Store.deleteMany({});
  await Product.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@adspot.rw',
    password: 'admin123',
    role: 'admin',
  });

  const seller = await User.create({
    name: 'Seller One',
    email: 'seller@adspot.rw',
    password: 'seller123',
    role: 'seller',
  });

  const store = await Store.create({
    name: 'Urban Style Rwanda',
    slug: 'urban-style-rwanda',
    description: 'Fashion and lifestyle essentials for Kigali shoppers.',
    category: 'Fashion',
    location: 'Kigali',
    contactPhone: '+250788123456',
    email: 'hello@urbanstyle.rw',
    owner: seller._id,
  });

  await Product.create({
    name: 'Nike Air Max',
    slug: 'nike-air-max',
    description: 'Lightweight everyday sneakers designed for comfort and city style.',
    price: 85000,
    category: 'Fashion',
    seller: seller._id,
    store: store._id,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200'],
    stock: 10,
    status: 'active',
    rating: 4.8,
  });

  console.log('Seed complete');
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
