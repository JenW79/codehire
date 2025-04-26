// backend/routes/api/notes.js
const express = require("express");
const router = express.Router();

// Get all notes for a job application
router.get("/applications/:id/notes", async (req, res) => {
  // Logic here
});

// Add a note to a job application
router.post("/applications/:id/notes", async (req, res) => {
  // Logic here
});

// Update a specific note
router.put("/notes/:noteId", async (req, res) => {
  // Logic here
});

// Delete a specific note
router.delete("/notes/:noteId", async (req, res) => {
  // Logic here
});

module.exports = router;
