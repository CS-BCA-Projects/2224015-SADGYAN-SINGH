const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const Service = require("../models/Service");

router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ msg: "Welcome to Admin Dashboard!" });
});

router.post("/services", authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, price, category } = req.body;
  try {
    const service = new Service({ name, description, price, category });
    await service.save();
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/services", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;