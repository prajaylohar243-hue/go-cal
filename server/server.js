const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 } // max 5MB
});

// 🔥 ROUTE
app.post("/detect-food", upload.single("image"), async (req, res) => {
  console.log("🔥 ROUTE HIT"); // 👈 CRITICAL DEBUG

  try {
    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ error: "No image uploaded" });
    }

    console.log("✅ Image received:", req.file.originalname);

    // 🔥 TEST MODE (UNCOMMENT TO DEBUG FRONTEND)
    /*
    return res.json([
      { label: "fried chicken", score: 0.99 }
    ]);
    */
require("dotenv").config();

const response = await axios.post(
  "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
  req.file.buffer,
  {
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/octet-stream",
    },
    timeout: 30000,
  }
);

    console.log("🔥 AI RESPONSE:", response.data);

    res.json(response.data);

  } catch (err) {
    console.log(
      "❌ AI ERROR FULL:",
      err.response?.data || err.message
    );

    res.status(500).json({
      error: "AI failed",
      details: err.response?.data || err.message
    });
  }
});

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://127.0.0.1:5000");
});