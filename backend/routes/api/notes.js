// backend/routes/api/notes.js
const express = require("express");
const router = express.Router();
const { Note } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { noteValidation } = require("../../utils/validation");


// Update a specific note PUT api/notes/:noteId
// This route allows users to update the content of a specific note.
router.put(
  "/notes/:noteId",
  requireAuth,
  noteValidation,
  async (req, res, next) => {
    try {
      const { content } = req.body;
      const noteId = req.params.noteId;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      const note = await Note.findOne({
        where: { id: noteId },
        include: { association: "Application" }, // Include the Application model to check userId
      });

      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }

      // Check if this note's application belongs to the logged-in user
      if (note.Application.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      note.content = content;
      await note.save();

      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete a specific note DELETE
// This route allows users to delete a specific note.
router.delete("/notes/:noteId", requireAuth, async (req, res, next) => {
  try {
    const noteId = req.params.noteId;

    const note = await Note.findOne({
      where: { id: noteId },
      include: { association: "Application" }, // Include the Application model to check userId
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.Application.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await note.destroy();

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
