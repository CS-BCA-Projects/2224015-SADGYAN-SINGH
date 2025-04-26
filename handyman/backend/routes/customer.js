const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const ServiceRequest = require("../models/ServiceRequest");

// Create a new service request
router.post("/requests", authMiddleware(["customer"]), async (req, res) => {
  const { serviceId, description, location, urgency } = req.body;
  try {
    const newRequest = new ServiceRequest({
      serviceId,
      customerId: req.user.id,
      description,
      location,
      urgency,
    });
    const request = await newRequest.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all requests by the customer
router.get("/requests", authMiddleware(["customer"]), async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customerId: req.user.id })
      .populate("serviceId")
      .populate("providerId");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;