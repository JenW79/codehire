// backend/routes/api/resumes.js
const express = require("express");
const router = express.Router();
const { Resume } = require("../../db/models");
const openai = require("../../utils/openai");
const { requireAuth } = require("../../utils/auth");

// Generate AI resume
router.post("/generate", requireAuth, async (req, res) => {
  const { summary, title = "Untitled Resume" } = req.body;
  const userId = req.user.id;

  if (process.env.NODE_ENV !== "production") {
  return res.json({
    userId: req.user.id,
    title,
    content: "Mocked resume for local dev. OpenAI quota not active yet."
  });
}

  const existing = await Resume.count({ where: { userId } });
  if (existing >= 2) {
    return res.status(403).json({ error: "Resume limit reached. Delete one to generate another." });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional resume writer for tech jobs." },
        { role: "user", content: `Generate a clean, ATS-friendly resume from the following summary:\n\n${summary}` },
      ],
    });

    const resumeText = completion.data.choices[0].message.content;

    const newResume = await Resume.create({
      userId,
      title,
      content: resumeText,
    });

    res.json(newResume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resume generation failed." });
  }
});

// Save a generated resume manually
router.post("/save", requireAuth, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;


  const count = await Resume.count({ where: { userId } });
  if (count >= 2) {
    return res.status(403).json({ error: "Resume limit reached." });
  }

  const newResume = await Resume.create({ userId, title, content });
  res.json(newResume);
});

// Get all resumes
router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.id;


  const resumes = await Resume.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  res.json(resumes);
});

// Delete a resume
router.delete("/:id", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const resume = await Resume.findByPk(req.params.id);

  if (!resume || resume.userId !== userId) {
    return res.status(404).json({ error: "Resume not found or unauthorized" });
  }

  await resume.destroy();
  res.json({ message: "Resume deleted." });
});

module.exports = router;


