import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/Dashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const servicesResponse = await axios.get("http://localhost:5000/api/admin/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const requestsResponse = await axios.get("http://localhost:5000/api/admin/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data);
        setServices(servicesResponse.data);
        setRequests(requestsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      }
    };
    fetchData();
  }, [token]);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(services.filter((service) => service._id !== serviceId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete service");
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
        <h2 className="dashboard-title">Admin Dashboard</h2>
        {error && <p className="dashboard-error">{error}</p>}

        {/* Users Section */}
        <div className="mb-12">
          <h3 className="dashboard-subtitle">Manage Users</h3>
          {users.length === 0 ? (
            <p className="dashboard-empty">No users found.</p>
          ) : (
            <div className="dashboard-grid">
              {users.map((user) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="dashboard-card"
                >
                  <p className="dashboard-card-title">Name: {user.name}</p>
                  <p className="dashboard-card-text">Email: {user.email}</p>
                  <p className="dashboard-card-text">Role: {user.role}</p>
                  <p className="dashboard-card-text">Phone: {user.phoneNumber}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteUser(user._id)}
                    className="dashboard-btn dashboard-btn-danger"
                  >
                    Delete User
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Services Section */}
        <div className="mb-12">
          <h3 className="dashboard-subtitle">Manage Services</h3>
          {services.length === 0 ? (
            <p className="dashboard-empty">No services found.</p>
          ) : (
            <div className="dashboard-grid">
              {services.map((service) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="dashboard-card"
                >
                  <p className="dashboard-card-title">Name: {service.name}</p>
                  <p className="dashboard-card-text">Description: {service.description}</p>
                  <p className="dashboard-card-text">Price: ₹{service.price}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteService(service._id)}
                    className="dashboard-btn dashboard-btn-danger"
                  >
                    Delete Service
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Requests Section */}
        <div>
          <h3 className="dashboard-subtitle">Manage Requests</h3>
          {requests.length === 0 ? (
            <p className="dashboard-empty">No requests found.</p>
          ) : (
            <div className="dashboard-grid">
              {requests.map((request) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="dashboard-card"
                >
                  <p className="dashboard-card-title">
                    Customer: {request.customerId?.name || "Unknown"}
                  </p>
                  <p className="dashboard-card-text">
                    Service: {request.serviceId?.name || "Unknown"}
                  </p>
                  <p className="dashboard-card-text">
                    Provider: {request.providerId?.name || "Unknown"}
                  </p>
                  <p className="dashboard-card-text">Status: {request.status}</p>
                  <p className="dashboard-card-text">Description: {request.description}</p>
                  <p className="dashboard-card-text">Address: {request.address}</p>
                  {request.image && (
                    <div className="mt-2">
                      <p className="dashboard-card-text">Issue Image:</p>
                      <img
                        src={request.image} // S3 URL will be used here after integration
                        alt="Issue"
                        className="dashboard-media"
                      />
                    </div>
                  )}
                  {request.video && (
                    <div className="mt-2">
                      <p className="dashboard-card-text">Issue Video:</p>
                      <video
                        src={request.video} // S3 URL will be used here after integration
                        controls
                        className="dashboard-media"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;