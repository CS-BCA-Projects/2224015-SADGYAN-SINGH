import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/Dashboard.css";

const AcceptRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/service-providers/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch pending requests");
      }
    };
    fetchData();
  }, [token]);

  const handleAccept = async (requestId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/service-providers/accept-request",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(requests.filter((req) => req._id !== requestId));
      setError(""); // Clear any previous error
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept request");
      console.error("Error accepting request:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <motion.div
        className="dashboard-box"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="dashboard-title">Accept Requests</h2>
        {error && <p className="dashboard-error">{error}</p>}
        {requests.length === 0 ? (
          <p className="dashboard-empty">No pending requests found.</p>
        ) : (
          <div className="dashboard-grid">
            {requests.map((request) => (
              <motion.div
                key={request._id}
                className="dashboard-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="dashboard-card-title">Customer: {request.customerId?.name || "Unknown"}</p>
                <p className="dashboard-card-text">Service: {request.serviceId?.name || "Unknown"}</p>
                <p className="dashboard-card-text">Description: {request.description}</p>
                <motion.button
                  className="dashboard-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAccept(request._id)}
                >
                  Accept
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AcceptRequests;