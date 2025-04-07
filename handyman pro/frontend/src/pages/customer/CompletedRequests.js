import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/Dashboard.css";

const CompletedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/customers/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Completed Requests Data (before filter):", response.data); // Debugging log
        const completedRequests = response.data.filter(request => request.status === "completed");
        console.log("Completed Requests Data (after filter):", completedRequests); // Debugging log
        setRequests(completedRequests);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch completed requests");
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
                <p className="dashboard-card-title">Service: {request.serviceId?.name || "Unknown"}</p>
                <p className="dashboard-card-text">Status: {request.status}</p>
                <p className="dashboard-card-text">Description: {request.description}</p>
                <p className="dashboard-card-text">Address: {request.address}</p>
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
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CompletedRequests;