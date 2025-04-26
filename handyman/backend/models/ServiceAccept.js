const mongoose = require("mongoose");

const serviceAcceptSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
    required: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  acceptDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ServiceAccept", serviceAcceptSchema);