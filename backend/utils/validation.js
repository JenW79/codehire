// backend/utils/validation.js
const { check, validationResult } = require("express-validator");

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.path] = error.msg));

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    return next(err);
  }
  next();
};

const applicationValidation = [
  check("companyName")
    .exists({ checkFalsy: true })
    .withMessage("Company name is required.")
    .isLength({ max: 255 })
    .withMessage("Company name must not be more than 255 characters."),

  check("positionTitle")
    .exists({ checkFalsy: true })
    .withMessage("Position title is required.")
    .isLength({ max: 255 })
    .withMessage("Position title must not be more than 255 characters."),

  check("status")
    .optional()
    .isString()
    .withMessage("Status must be a string.")
    .isIn(["Pending", "Interview", "Offer", "Rejected", "Withdrawn"])
    .withMessage(
      "Status must be one of: Pending, Interview, Offer, Rejected, or Withdrawn."
    )
    .isLength({ max: 50 })
    .withMessage("Status must be a string with no more than 50 characters."),

  check("appliedAt")
    .optional()
    .isISO8601()
    .withMessage("Applied date must be a valid date (YYYY-MM-DD format)."),
  handleValidationErrors,
];

const noteValidation = [
  check("content")
    .exists({ checkFalsy: true })
    .withMessage("Content is required.")
    .isLength({ max: 1000 })
    .withMessage("Content must not be more than 1000 characters."),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  applicationValidation,
  noteValidation,
};
