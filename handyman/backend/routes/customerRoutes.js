const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const ServiceRequest = require("../models/ServiceRequest");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const customer = await User.findById(req.user.id).select("-password");
    if (!customer || customer.role !== "customer") {
      return res.status(404).json({ msg: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/requests", authMiddleware, async (req, res) => {
  const { serviceId, description, location, urgency } = req.body;
  try {
    const request = new ServiceRequest({
      customerId: req.user.id,
      serviceId,
      description,
      location,
      urgency,
    });
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/requests", authMiddleware, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customerId: req.user.id })
      .populate("serviceId")
      .populate("providerId");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;