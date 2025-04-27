// backend/routes/api/applications.js

const express = require("express");
const router = express.Router();
const { Application, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { applicationValidation } = require("../../utils/validation");

// Get all job applications for current user GET /api/applications
// This route retrieves all job applications for the authenticated user
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ["username"] }],
      order: [
        ["createdAt", "DESC"],
        ["updatedAt", "DESC"],
      ],
    });
    return res.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single job application by ID GET /api/applications/:id
// This route retrieves a specific job application for the authenticated user
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const application = await Application.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: User, attributes: ["username"] }],
    });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res.json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new job application POST /api/applications
// This route creates a new job application for the authenticated user
router.post("/", requireAuth, applicationValidation, async (req, res, next) => {
  try {
    const { companyName, positionTitle, status, appliedAt } = req.body;
    const newApplication = await Application.create({
      userId: req.user.id,
      companyName,
      positionTitle,
      status,
      appliedAt,
    });
    return res.status(201).json({ application: newApplication });
  } catch (error) {
    console.error("Error creating application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update an existing job application PUT /api/applications/:id
// This route updates a specific job application for the authenticated user
router.put(
  "/:id",
  requireAuth,
  applicationValidation,
  async (req, res, next) => {
    try {
      const application = await Application.findOne({
        where: { id: req.params.id, userId: req.user.id },
      });

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const { companyName, positionTitle, status, appliedAt } = req.body;

      await application.update({
        companyName,
        positionTitle,
        status,
        appliedAt,
      });

      return res.json({ application });
    } catch (error) {
      console.error("Error updating application:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Delete a job application DELETE /api/applications/:id
// This route deletes a specific job application for the authenticated user
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const application = await Application.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
