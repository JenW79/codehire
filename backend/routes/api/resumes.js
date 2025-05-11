// backend/routes/api/resumes.js
const express = require("express");
const router = express.Router();
const { Resume } = require("../../db/models");
const openai = require("../../utils/openai");
const { requireAuth } = require("../../utils/auth");
const { Op } = require("sequelize");

router.post("/generate", requireAuth, async (req, res) => {
  const { summary, title = "Untitled Resume" } = req.body;
  const userId = req.user.id;

  // // Mock for non-production environments
  // if (process.env.NODE_ENV !== "production") {
  //   const mockContent = `**Summary:**\n\nExperienced frontend developer with a strong background in React and Redux.`;

  //   const newResume = await Resume.create({
  //     userId,
  //     title,
  //     content: mockContent,
  //   });

  //   return res.json(newResume);
  // }

  const estimatedTokens = Math.ceil(summary.length / 4);
  if (estimatedTokens > 800) {
    return res.status(400).json({ error: "Summary is too long. Please shorten it." });
  }

  // Check if the user has already generated 3 resumes today
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight for "today"

  const countToday = await Resume.count({
    where: {
      userId,
      createdAt: { [Op.gte]: today },
    },
  });

   if (countToday >= 3) {
    return res.status(403).json({
      error: "You have reached your daily resume generation limit. Try again tomorrow.",
      dailyLimitReached: true,
      resumesUsed: countToday, 
      maxResumes: 3, 
    });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer for tech jobs.",
        },
        {
          role: "user",
          content: `Generate a clean, ATS-friendly resume from the following summary:\n\n${summary}`,
        },
      ],
    });

    const resumeText = completion.data.choices[0].message.content;

    const newResume = await Resume.create({
      userId,
      title,
      content: resumeText,
    });

     res.json({
      newResume,
      resumesUsed: countToday + 1, 
      maxResumes: 3,
    });
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

  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countToday = await Resume.count({
    where: {
      userId,
      createdAt: { [Op.gte]: today },
    },
  });

  res.json({
    resumes,
    resumesUsed: countToday,
    maxResumes: 3,
  });
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
