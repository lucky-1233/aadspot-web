require("dotenv").config();

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const storeRoutes = require("./routes/storeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: '8mb' }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AdSpot API is running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    name: "AdSpot Rwanda API",
    version: "1.0.0",
    message: "Welcome to the AdSpot API.",
  });
});

/* =========================
   API ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

/* =========================
   404
========================= */

app.use("/api", (req, res) => {
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
      console.log(
        connected
          ? "Database status: connected"
          : "Database status: disconnected"
      );
    });
  };

  startServer();
}

module.exports = app;