// backend/routes/api/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const jwt = require('jsonwebtoken');
const transporter = require("../../utils/transporter")

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("First Name is required."),
  check("lastName")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Last Name is required."),
  handleValidationErrors,
];

//Signup
router.post("/", validateSignup, async (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password);

    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      hashedPassword,
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.status(201).json({
      user: safeUser,
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(500).json({
        message: "User already exists",
        errors: {
          email: "User with that email already exists",
          username: "Username must be unique.",
        },
      });
    }
    next(err);
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.unscoped().findOne({ where: { email } });

  if (!user) {
    return res.status(200).json({ message: 'If that email exists, a reset link was sent.' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"Codehire Support" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Reset Your Codehire Password',
    html: `
      <div style="font-family: Arial, sans-serif; background: #232222; color: #f1f1f1; padding: 20px; border-radius: 8px;">
        <h2 style="color: #d77c13;">Reset Your Password</h2>
        <p>Hello ${user.username},</p>
        <p>We received a request to reset the password for your <strong>Codehire</strong> account.</p>
        <p>Click the button below to choose a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #d77c13; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Reset Password
        </a>
        <p style="margin-top: 16px;">If you did not request this, you can safely ignore this email.</p>
        <p style="font-size: 0.9rem; color: #aaa;">This link will expire in 15 minutes.</p>
      </div>
    `,
  });

  return res.json({ message: 'If that email exists, a reset link was sent.' });
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.unscoped().findByPk(decoded.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.hashedPassword = bcrypt.hashSync(newPassword);
    await user.save();

    return res.json({ message: 'Password reset successful. You may now log in.' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
});


module.exports = router;
