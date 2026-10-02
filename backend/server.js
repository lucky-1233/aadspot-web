require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin is not allowed by CORS'));
  },
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AdSpot API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    name: 'AdSpot Rwanda API',
    version: '1.0.0',
    message: 'Welcome to the AdSpot API. Visit /api/health to check service status.',
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

if (require.main === module) {
  const startServer = async () => {
    const connected = await connectDB();

    app.listen(PORT, () => {
      console.log(`AdSpot API running on port ${PORT}`);
      console.log(connected ? 'Database status: connected' : 'Database status: disconnected');
    });
  };

  startServer();
}

module.exports = app;
