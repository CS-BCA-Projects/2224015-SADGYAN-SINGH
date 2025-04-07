const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Service = require("../models/Service");
const ServicePending = require("../models/servicePending");
const ServiceCompleted = require("../models/serviceCompleted");
const ServiceRequest = require("../models/ServiceRequest");

// Add a new service by service provider
router.post("/services", authMiddleware(["service-provider"]), async (req, res) => {
  const { name, description, price, category } = req.body;
  try {
    const newService = new Service({
      name,
      description,
      price,
      category,
      providerId: req.user.id,
    });
    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all services added by the service provider
router.get("/services", authMiddleware(["service-provider"]), async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user.id }).sort({ createdAt: 1 });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Add a new pending request
router.post("/pending-requests", authMiddleware(["service-provider"]), async (req, res) => {
  try {
    const { customerId, serviceId, description, address } = req.body;
    const pendingRequest = new ServicePending({
      customerId,
      serviceId,
      description,
      address,
    });
    await pendingRequest.save();
    res.status(201).json(pendingRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all pending requests for the service provider
router.get("/pending-requests", authMiddleware(["service-provider"]), async (req, res) => {
  try {
    const pendingRequests = await ServicePending.find();
    res.json(pendingRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all in-progress requests for the service provider
router.get("/requests", authMiddleware(["service-provider"]), async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ providerId: req.user.id, status: "In Progress" })
      .populate("serviceId")
      .populate("customerId");
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Accept a service request (move from servicePending to ServiceRequest)
router.put("/requests/:id/accept", authMiddleware(["service-provider"]), async (req, res) => {
  try {
    const pendingRequest = await ServicePending.findById(req.params.id);
    if (!pendingRequest) return res.status(404).json({ msg: "Pending request not found" });

    const newRequest = new ServiceRequest({
      customerId: pendingRequest.customerId,
      serviceId: pendingRequest.serviceId,
      description: pendingRequest.description,
      address: pendingRequest.address,
      providerId: req.user.id,
      status: "In Progress",
    });
    await newRequest.save();

    await ServicePending.findByIdAndDelete(req.params.id);
    res.json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Move request to completed when completed
router.post("/complete-request", authMiddleware(["service-provider"]), async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await ServiceRequest.findById(requestId);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    if (request.providerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    if (request.status !== "In Progress") {
      return res.status(400).json({ msg: "Request not in progress" });
    }

    // Move to serviceCompleted
    const completedRequest = new ServiceCompleted({
      customerId: request.customerId,
      serviceId: request.serviceId,
      description: request.description,
      address: request.address,
      providerId: request.providerId,
    });
    await completedRequest.save();

    // Remove from ServiceRequest collection
    await ServiceRequest.findByIdAndDelete(requestId);

    res.json({ message: "Request completed and moved to completed records" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all completed requests for the service provider
router.get("/completed-requests", authMiddleware(["service-provider"]), async (req, res) => {
  try {
    const completedRequests = await ServiceCompleted.find({ providerId: req.user.id });
    res.json(completedRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;