const express = require("express");
const router = express.Router();
const ServiceRequest = require("../models/ServiceRequest");
const mongoose = require("mongoose");

router.get("/service-request/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId.trim();
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const requests = await ServiceRequest.find({ customerId: new mongoose.Types.ObjectId(customerId) })
      .populate("serviceId")
      .populate("providerId");
    if (!requests.length) {
      return res.status(404).json({ message: "No service requests found" });
    }
    res.json(requests);
  } catch (error) {
    console.error("Error fetching service requests:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;