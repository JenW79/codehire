// backend/routes/api/jobs.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// Proxy to JSearch and Remotive APIs for job searching
router.get("/search", async (req, res) => {
  try {
    // Secure proxying logic (fill in later)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs." });
  }
});

module.exports = router;
