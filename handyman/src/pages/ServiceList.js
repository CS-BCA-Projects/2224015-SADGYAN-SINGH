import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/Dashboard.css";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch services");
      }
    };
    fetchData();
  }, [token]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <motion.div
        className="dashboard-box"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="dashboard-title">Services List</h2>
        <div className="mb-4">
          <input
            type="text"
            className="form-control auth-input"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {error && <p className="dashboard-error">{error}</p>}
        {filteredServices.length === 0 ? (
          <p className="dashboard-empty">No services found.</p>
        ) : (
          <div className="dashboard-grid">
            {filteredServices.map((service) => (
              <motion.div
                key={service._id}
                className="dashboard-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="dashboard-card-title">Name: {service.name}</p>
                <p className="dashboard-card-text">Description: {service.description}</p>
                <p className="dashboard-card-text">Price: ₹{service.price}</p>
                <p className="dashboard-card-text">Category: {service.category}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ServicesList;