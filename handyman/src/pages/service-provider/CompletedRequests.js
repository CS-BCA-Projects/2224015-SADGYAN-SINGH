import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/Dashboard.css";

const CompletedRequestsServiceProvider = ({ showNotification }) => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/service-providers/accepted-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Service Provider Completed Requests Data (before filter):", response.data);
        const completedRequests = response.data.filter(request => request.status === "completed");
        console.log("Service Provider Completed Requests Data (after filter):", completedRequests);
        setRequests(completedRequests);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch completed requests");
        showNotification("Failed to fetch completed requests: " + (err.response?.data?.message || "Server error"));
      }
    };
    fetchData();
  }, [token, showNotification]);

  return (
    <div className="dashboard-container">
      <motion.div
        className="dashboard-box"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="dashboard-title">Completed Requests</h2>
        {error && <p className="dashboard-error">{error}</p>}
        {requests.length === 0 ? (
          <p className="dashboard-empty">No completed requests found.</p>
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
                <p className="dashboard-card-text">Address: {request.address || "N/A"}</p>
                <p className="dashboard-card-text">Phone Number: {request.customerId?.phoneNumber || "N/A"}</p>
                <p className="dashboard-card-text">Description: {request.description}</p>
                {request.image && (
                  <div className="mt-2">
                    <p className="dashboard-card-text">Issue Image:</p>
                    <img src={request.image} alt="Issue" className="dashboard-media" />
                  </div>
                )}
                {request.video && (
                  <div className="mt-2">
                    <p className="dashboard-card-text">Issue Video:</p>
                    <video src={request.video} controls className="dashboard-media" />
                  </div>
                )}
                <p className="dashboard-card-text">Status: {request.status}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CompletedRequestsServiceProvider;