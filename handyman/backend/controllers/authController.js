const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Customer = require("../models/Customer");
const ServiceProvider = require("../models/ServiceProvider");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role, address, experience } = req.body;
    console.log("Extracted data:", { name, email, password, phoneNumber, role, address, experience }); // Debug log

    let user = await User.findOne({ email });
    if (user) {
      console.log("Email already registered:", email); // Debug log
      return res.status(400).json({ msg: "Email already registered" });
    }

    user = await User.findOne({ phone: phoneNumber });
    if (user) {
      console.log("Phone number already registered:", phoneNumber); // Debug log
      return res.status(400).json({ msg: "Phone number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully"); // Debug log

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone: phoneNumber,
      role,
    });
    await newUser.save();
    console.log("User saved:", newUser); // Debug log

    if (role === "customer") {
      const customer = new Customer({
        userId: newUser._id,
        name,
        phoneNumber,
        address,
      });
      await customer.save();
      console.log("Customer saved:", customer); // Debug log
    } else if (role === "service-provider") {
      const serviceProvider = new ServiceProvider({
        userId: newUser._id,
        name,
        phoneNumber,
        experience,
      });
      await serviceProvider.save();
      console.log("ServiceProvider saved:", serviceProvider); // Debug log
    }

    const payload = { id: newUser._id, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Token generated:", token); // Debug log

    res.status(201).json({
      msg: "User registered successfully",
      token,
      role: newUser.role,
      name: newUser.name,
    });
  } catch (err) {
    console.error("Error in registerUser:", err); // Debug log
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