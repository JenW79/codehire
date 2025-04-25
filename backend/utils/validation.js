// backend/utils/validation.js
const { check, validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

// Spot validation middleware
const spotValidation = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Address is required.'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required.'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required.'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required.'),
    check('lat')
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude is not valid.'),
  check('lng')
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude is not valid.'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters.'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required.'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Price per day is required and must be greater than or equal to 0.'),
  handleValidationErrors, 
];


module.exports = {
  handleValidationErrors,
  spotValidation,
};