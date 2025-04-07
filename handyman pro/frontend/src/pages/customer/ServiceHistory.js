import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/Dashboard.css";

const RequestsHistory = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/customers/requests", { // Changed to /api/customers/requests
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter out pending requests to show history
        const historyRequests = response.data.filter(request => request.status !== "pending");
        setRequests(historyRequests);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch request history");
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="dashboard-container">
      <motion.div
        className="dashboard-box"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="dashboard-title">Request History</h2>
        {error && <p className="dashboard-error">{error}</p>}
        {requests.length === 0 ? (
          <p className="dashboard-empty">No request history found.</p>
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
                <p className="dashboard-card-title">Service: {request.serviceId?.name || "Unknown"}</p>
                <p className="dashboard-card-text">Status: {request.status}</p>
                <p className="dashboard-card-text">Description: {request.description}</p>
                <p className="dashboard-card-text">Address: {request.address}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RequestsHistory;