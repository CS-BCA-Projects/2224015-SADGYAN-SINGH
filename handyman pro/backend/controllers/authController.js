const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, address, services, experience, location } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email already registered" });

    user = await User.findOne({ phone });
    if (user) return res.status(400).json({ msg: "Phone number already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      address: role === "customer" ? address : undefined,
      services: role === "service-provider" ? services : undefined,
      experience: role === "service-provider" ? experience : undefined,
      location: role === "service-provider" ? location : undefined,
    });
    await newUser.save();

    const payload = { id: newUser._id, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      msg: "User registered successfully",
      token,
      role: newUser.role,
      name: newUser.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = { registerUser, loginUser };