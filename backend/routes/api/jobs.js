const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");
require("dotenv").config();
const normalizeJob = require("../../utils/normalizeJob");
const { requireAuth } = require("../../utils/auth");



// Cache instance (24 hours)
const remotiveCache = new NodeCache({ stdTTL: 86400 });
const jobCache = new NodeCache({ stdTTL: 86400 });

//GET /api/jobs/search	Unified search (Remotive/JSearch)
router.get("/search", requireAuth, async (req, res) => {
  const { query, location = "remote", page = 1 } = req.query;
  const isRemote = location.toLowerCase() === "remote";
  const cleanQuery = query?.toLowerCase().trim() || "developer";

  try {
    if (isRemote) {
      const cacheKey = `remotive:${cleanQuery}`;
      const cached = remotiveCache.get(cacheKey);

      if (cached) {
        console.log(" Using cached Remotive result");
        return res.json({ source: "remotive", results: cached });
      }

      const response = await axios.get("https://remotive.com/api/remote-jobs", {
        params: { search: cleanQuery },
      });

      const jobs = response.data.jobs
        .map((job) => normalizeJob(job, "remotive"))
        .filter(
          (job) =>
            job.title.toLowerCase().includes(cleanQuery) ||
            job.company.toLowerCase().includes(cleanQuery)
        );

      if (jobs.length === 0) {
        return res
          .status(404)
          .json({ error: "No jobs found for that keyword." });
      }
      remotiveCache.set(cacheKey, jobs);
      return res.json({ source: "remotive", results: jobs });
    }

    // JSearch for non-remote queries
    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: {
        query: `${cleanQuery} in ${location}`,
        page,
        num_pages: 1,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    });

    const jobs = response.data.data
      .map((job) => normalizeJob(job, "jsearch"))
      .filter(
        (job) =>
          job.title.toLowerCase().includes(cleanQuery) ||
          job.company.toLowerCase().includes(cleanQuery)
      );

    if (!jobs.length) {
      return res.status(404).json({ error: "No jobs found for that keyword." });
    }
    return res.json({ source: "jsearch", results: jobs });
  } catch (err) {
    console.error(" Job search failed:", err.message);
    return res.status(500).json({ error: "Failed to fetch job listings." });
  }
});

//GET /api/jobs/:source/:id	View individual job details
router.get("/jobs/:source/:id", requireAuth, async (req, res) => {
  const { source, id } = req.params;
  const cacheKey = `job:${source}:${id}`;
  const cached = jobCache.get(cacheKey);

  if (cached) {
    console.log("Loaded job from cache");
    return res.json(cached);
  }

  try {
    // Re-query based on source
    if (source === "remotive") {
      const response = await axios.get("https://remotive.com/api/remote-jobs", {
        params: { limit: 100 },
      });

      const job = response.data.jobs.find((j) => j.id.toString() === id);
      if (!job) return res.status(404).json({ error: "Job not found" });

      const normalized = normalizeJob(job, source);
      jobCache.set(cacheKey, normalized);
      return res.json(normalized);
    }

    if (source === "jsearch") {
      const response = await axios.get(
        "https://jsearch.p.rapidapi.com/job-details",
        {
          params: { job_id: id },
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
          },
        }
      );

      const job = response.data.data?.[0];
      if (!job) return res.status(404).json({ error: "Job not found" });

      const normalized = normalizeJob(job, source);
      jobCache.set(cacheKey, normalized);
      return res.json(normalized);
    }

    return res.status(400).json({ error: "Invalid source" });
  } catch (err) {
    console.error("Failed to fetch job detail:", err.message);
    return res.status(500).json({ error: "Failed to fetch job details." });
  }
});

module.exports = router;
