import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/Dashboard.css";

const CustomerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    const fetchData = async () => {
      try {
        const [requestsRes, acceptedRes] = await Promise.all([
          axios.get("http://localhost:5000/api/customers/requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/customers/notifications", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (isMounted) {
          setRequests(requestsRes.data);
          setAcceptedRequests(acceptedRes.data);
          setCompletedRequests(requestsRes.data.filter(request => request.status === "completed"));
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching data:", error);
          setError(error.response?.data?.message || "Failed to fetch data");
        }
      }
    };

    fetchData(); // Initial fetch

    // Polling every 10 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    // Cleanup on unmount
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [token]);

  const handleComplete = async (requestId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/customers/complete-request",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh data immediately after marking as complete
      const updatedRequests = requests.map(req =>
        req._id === requestId ? { ...req, status: "completed" } : req
      );
      setRequests(updatedRequests);
      setCompletedRequests(updatedRequests.filter(req => req.status === "completed"));
      setAcceptedRequests(acceptedRequests.filter(req => req.requestId._id !== requestId));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark request as completed");
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
        <h2 className="dashboard-title">Customer Dashboard</h2>
        {error && <p className="dashboard-error">{error}</p>}
        <div className="mb-5">
          <h3 className="dashboard-subtitle">Your Requests</h3>
          {requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table dashboard-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.serviceId?.name || "Unknown"}</td>
                      <td>{request.description}</td>
                      <td>{request.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mb-5">
          <h3 className="dashboard-subtitle">Service History (Accepted Requests)</h3>
          {acceptedRequests.length === 0 ? (
            <p>No accepted requests found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table dashboard-table">
                <thead>
                  <tr>
                    <th>Provider Name</th>
                    <th>Phone Number</th>
                    <th>Experience</th>
                    <th>Request Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedRequests.map((notification) => (
                    <tr key={notification._id}>
                      <td>{notification.providerId?.name || "Unknown"}</td>
                      <td>{notification.providerId?.phoneNumber || "N/A"}</td>
                      <td>{notification.providerId?.experience || "N/A"}</td>
                      <td>{notification.requestId?.description || "N/A"}</td>
                      <td>{notification.requestId?.status || "N/A"}</td>
                      <td>
                        {notification.requestId?.status === "accepted" && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleComplete(notification.requestId._id)}
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          <h3 className="dashboard-subtitle">Completed Requests</h3>
          {completedRequests.length === 0 ? (
            <p>No completed requests found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table dashboard-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedRequests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.serviceId?.name || "Unknown"}</td>
                      <td>{request.description}</td>
                      <td>{request.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerDashboard;