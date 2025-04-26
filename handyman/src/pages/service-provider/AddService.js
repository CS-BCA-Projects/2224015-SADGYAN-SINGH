import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/AddService.css";

const AddService = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/service-providers/services",
        { name, description, price, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
    } catch (error) {
      console.error("Error adding service:", error);
      alert(error.response?.data?.message || "Failed to add service");
    }
  };

  return (
    <div className="add-service-container">
      <motion.div
        className="add-service-box"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="add-service-title">Add New Service</h2>
        <form onSubmit={handleSubmit} className="add-service-form">
          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-control add-service-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description:</label>
            <textarea
              className="form-control add-service-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Price:</label>
            <input
              type="number"
              className="form-control add-service-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Category:</label>
            <select
              className="form-select add-service-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" className="btn add-service-btn w-100">
            Add Service
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddService;