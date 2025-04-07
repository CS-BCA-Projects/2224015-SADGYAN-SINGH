const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const User = require("../models/User");

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be 6+ chars").isLength({ min: 6 }),
    check("phone", "Phone number is required").not().isEmpty(),
    check("role", "Invalid role").isIn(["customer", "service-provider", "admin"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    await registerUser(req, res);
  }
);

router.post(
  "/login",
  [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    await loginUser(req, res);
  }
);

router.post("/forget", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;