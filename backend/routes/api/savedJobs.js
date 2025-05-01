const express = require("express");
const router = express.Router();
const { SavedJob } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// GET saved jobs for current user /saved-jobs
router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const savedJobs = await SavedJob.findAll({ where: { userId } });
  res.json(savedJobs);
});

// POST save a job /saved-jobs
router.post("/", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { jobId, source, title, company, location, applyUrl } = req.body;
  
    const existing = await SavedJob.findOne({
      where: { userId, jobId, source },
    });
  
    if (existing) return res.status(400).json({ error: "Already saved" });
  
    const saved = await SavedJob.create({
      userId,
      jobId,
      source,
      title,
      company,
      location,
      applyUrl,
    });
  
    res.status(201).json(saved);
  });

  // DELETE a saved job /savedJobs/:id
router.delete("/:id", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
  
    const job = await SavedJob.findOne({ where: { id, userId } });
  
    if (!job) return res.status(404).json({ error: "Not found" });
  
    await job.destroy();
    res.json({ message: "Deleted" });
  });
  
  module.exports = router;