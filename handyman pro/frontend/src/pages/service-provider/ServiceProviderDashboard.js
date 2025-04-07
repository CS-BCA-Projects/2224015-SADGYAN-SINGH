import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/Dashboard.css";

const ServiceProviderDashboard = ({ showNotification }) => {
  const [services, setServices] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [servicesRes, pendingRes, acceptedRes, completedRes] = await Promise.all([
          axios.get("http://localhost:5000/api/service-providers/services", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/service-providers/pending-requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/service-providers/accepted-requests", { // Updated endpoint
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/service-providers/completed-requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (isMounted) {
          setServices(servicesRes.data);
          setPendingRequests(pendingRes.data);
          setAcceptedRequests(acceptedRes.data);
          setCompletedRequests(completedRes.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching data:", error);
          setError(error.response?.data?.message || "Failed to fetch data");
        }
      }
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [token]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/service-providers/accept-request",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingRequests(pendingRequests.filter((request) => request._id !== requestId));
      showNotification("Request accepted successfully!");
      const acceptedRes = await axios.get("http://localhost:5000/api/service-providers/accepted-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAcceptedRequests(acceptedRes.data);
    } catch (error) {
      console.error("Error accepting request:", error);
      showNotification("Failed to accept request: " + (error.response?.data?.message || "Server error"));
    }
  };

  const handleComplete = async (requestId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/customers/complete-request", // Assuming this is the correct endpoint
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAcceptedRequests(acceptedRequests.filter((request) => request._id !== requestId));
      showNotification("Request marked as completed!");
      const completedRes = await axios.get("http://localhost:5000/api/service-providers/completed-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompletedRequests(completedRes.data);
    } catch (error) {
      console.error("Error completing request:", error);
      showNotification("Failed to mark request as completed: " + (error.response?.data?.message || "Server error"));
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
        <h2 className="dashboard-title">Service Provider Dashboard</h2>
        {error && <p className="dashboard-error">{error}</p>}
        <div className="mb-5">
          <h3 className="dashboard-subtitle">Your Services</h3>
          {services.length === 0 ? (
            <p>No services found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id}>
                      <td>{service.name}</td>
                      <td>{service.description}</td>
                      <td>₹{service.price}</td>
                      <td>{service.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mb-5">
          <h3 className="dashboard-subtitle">Pending Requests</h3>
          {pendingRequests.length === 0 ? (
            <p>No pending requests found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table dashboard-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Description</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.customerId?.name || "Unknown"}</td>
                      <td>{request.description}</td>
                      <td>{request.address}</td>
                      <td>{request.status}</td>
                      <td>
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mb-5">
          <h3 className="dashboard-subtitle">Accepted Requests</h3>
          {acceptedRequests.length === 0 ? (
            <p>No accepted requests found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table dashboard-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedRequests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.customerId?.name || "Unknown"}</td>
                      <td>{request.address || "N/A"}</td>
                      <td>{request.customerId?.phoneNumber || "N/A"}</td>
                      <td>{request.description}</td>
                      <td>{request.status}</td>
                      <td>
                        {request.status === "accepted" && (
                          <button
                            onClick={() => handleComplete(request._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
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
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedRequests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.customerId?.name || "Unknown"}</td>
                      <td>{request.address || "N/A"}</td>
                      <td>{request.customerId?.phoneNumber || "N/A"}</td>
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

export default ServiceProviderDashboard;