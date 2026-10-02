const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/adspot";
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AdSpot API is running 🚀"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AdSpot API is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("MongoDB connected ✅");

    app.listen(port, () => {
      console.log(`AdSpot server running on port ${port} 🚀`);
    });
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);

    app.listen(port, () => {
      console.log(`AdSpot server running on port ${port} 🚀`);
      console.log("Database status: disconnected");
    });
  }
};

startServer();