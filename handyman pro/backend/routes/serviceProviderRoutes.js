const express = require("express");
const router = express.Router();
const { authMiddleware, serviceProviderMiddleware } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const ServiceRequest = require("../models/ServiceRequest");

router.get("/profile", authMiddleware, serviceProviderMiddleware, async (req, res) => {
  try {
    const provider = await User.findById(req.user.id).select("-password");
    if (!provider) return res.status(404).json({ msg: "Service Provider not found" });
    res.json(provider);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/profile", authMiddleware, serviceProviderMiddleware, async (req, res) => {
  const { name, services, experience, location, phone } = req.body;
  try {
    let provider = await User.findById(req.user.id);
    if (!provider) return res.status(404).json({ msg: "Service Provider not found" });

    if (name) provider.name = name;
    if (services) provider.services = services;
    if (experience) provider.experience = experience;
    if (location) provider.location = location;
    if (phone) provider.phone = phone;

    await provider.save();
    res.json({ msg: "Profile updated", provider });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/requests", authMiddleware, serviceProviderMiddleware, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ status: "Pending" }).populate("customerId").populate("serviceId");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/requests/:id/accept", authMiddleware, serviceProviderMiddleware, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    request.providerId = req.user.id;
    request.status = "In Progress";
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;