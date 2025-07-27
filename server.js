const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API: fetch all rates
app.get("/api/rates", async (req, res) => {
  const base = req.query.base || "USD";
  try {
    const url = `https://open.er-api.com/v6/latest/${base}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
