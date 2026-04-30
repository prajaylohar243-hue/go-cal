const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        inputs: message,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          return_full_text: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`, // ✅ FIXED
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data[0]?.generated_text || "No response";

    res.json({ reply });

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});