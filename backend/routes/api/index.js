/// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");

const { restoreUser } = require("../../utils/auth.js");
const applicationsRouter = require("./applications");
const notesRouter = require("./notes");
const jobsRouter = require("./jobs");
const resumesRouter = require("./resumes");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/applications", applicationsRouter);

router.use("/", notesRouter); // notes are nested under applications

router.use("/jobs", jobsRouter);

router.use("/resumes", resumesRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

router.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

module.exports = router;
