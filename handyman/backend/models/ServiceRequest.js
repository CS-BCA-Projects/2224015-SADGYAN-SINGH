const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  description: {
    type: String,
    required: true, // Description of the issue
  },
  address: {
    type: String,
    required: true, // Address where service is needed
  },
  image: {
    type: String, // Path to the uploaded image
    required: false,
  },
  video: {
    type: String, // Path to the uploaded video
    required: false,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "rejected"],
    default: "pending",
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);