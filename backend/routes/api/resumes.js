// backend/routes/api/resumes.js
const express = require("express");
const router = express.Router();
const { Resume } = require("../../db/models");
const openai = require("../../utils/openai");
const { requireAuth } = require("../../utils/auth");
const { Op } = require("sequelize");

const sanitize = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .trim()
    .replace(/<[^>]*>?/gm, "")
    .slice(0, 1000);
};

router.post("/generate", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    jobTitle,
    education,
    skills,
    summary,
    experience = [],
    title = "Generated Resume",
  } = req.body;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countToday = await Resume.count({
    where: {
      userId,
      createdAt: { [Op.gte]: today },
    },
  });

  if (countToday >= 3) {
    return res.status(403).json({
      error: "You have reached your daily resume generation limit.",
      resumesUsed: countToday,
      maxResumes: 3,
    });
  }

  // Sanitize inputs
  const safeName = sanitize(name);
  const safeTitle = sanitize(jobTitle);
  const safeEducation = sanitize(education);
  const safeSkills = sanitize(skills);
  const safeSummary = sanitize(summary);
  const safeExperience = Array.isArray(experience)
    ? experience
        .slice(0, 3)
        .map((job) => ({
          title: sanitize(job.title),
          company: sanitize(job.company),
          description: sanitize(job.description),
        }))
        .filter(
          (job) =>
            job.title.length > 1 ||
            job.company.length > 1 ||
            job.description.length > 1
        )
    : [];

  const baseTitle = sanitize(title || "Generated Resume");

  const allTitles = await Resume.findAll({
    where: { userId },
    attributes: ["title"],
  });

  const existingTitlesSet = new Set(
    allTitles
      .map((r) => r.title)
      .filter((t) => t?.toLowerCase().startsWith(baseTitle.toLowerCase()))
      .map((t) => t.toLowerCase())
  );

  let finalTitle = baseTitle;
  let counter = 2;
  while (existingTitlesSet.has(finalTitle.toLowerCase())) {
    finalTitle = `${baseTitle} (${counter})`;
    counter++;
  }

  const isMeaningful = (value) => value.length >= 1;

  if (
    !isMeaningful(safeName) ||
    !isMeaningful(safeTitle) ||
    !isMeaningful(safeSkills) ||
    !isMeaningful(safeSummary)
  ) {
    return res
      .status(400)
      .json({ error: "Missing or invalid resume details." });
  }

  // Build prompt
  let prompt = `Generate a professional resume for:\n\n`;
  prompt += `Name: ${safeName}\nJob Title: ${safeTitle}\nEducation: ${safeEducation}\nSkills: ${safeSkills}\nSummary: ${safeSummary}\n`;

  if (safeExperience.length) {
    prompt += `Experience:\n`;
    for (let job of safeExperience) {
      prompt += `- ${job.title} at ${job.company}: ${job.description}\n`;
    }
  }

  prompt += `\nFormat it cleanly and make it ATS-friendly.`;

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
          content: prompt,
        },
      ],
    });

    const resumeText = completion.data.choices[0].message.content;

    const newResume = await Resume.create({
      userId,
      title: finalTitle,
      content: resumeText,
      name: safeName,
      jobTitle: safeTitle,
      education: safeEducation,
      skills: safeSkills,
      summary: safeSummary,
      experience: safeExperience,
    });

    res.json({
      newResume,
      resumesUsed: countToday + 1,
      maxResumes: 3,
    });
  } catch (err) {
    console.error(
      "Resume Generation Error:",
      err.response?.data || err.message || err
    );
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

// Update a resume
router.put("/:id", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { title, content } = req.body;
  const resume = await Resume.findByPk(req.params.id);

  if (!resume || resume.userId !== userId) {
    return res.status(404).json({ error: "Resume not found or unauthorized" });
  }

  resume.title = title || resume.title;
  resume.content = content || resume.content;
  resume.name = req.body.name || resume.name;
  resume.jobTitle = req.body.jobTitle || resume.jobTitle;
  resume.education = req.body.education || resume.education;
  resume.skills = req.body.skills || resume.skills;
  resume.summary = req.body.summary || resume.summary;
  resume.experience = req.body.experience || resume.experience;
  await resume.save();

  res.json(resume);
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
