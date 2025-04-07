import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/ServiceRequest.css";

const CustomerServiceRequest = () => {
  const [serviceId, setServiceId] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("serviceId", serviceId);
      formData.append("description", description);
      formData.append("address", address);
      if (image) formData.append("image", image);
      if (video) formData.append("video", video);

      const response = await axios.post(
        "http://localhost:5000/api/customers/requests",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
      setServiceId("");
      setDescription("");
      setAddress("");
      setImage(null);
      setVideo(null);
      setImagePreview(null);
      setVideoPreview(null);
    } catch (error) {
      console.error("Error creating service request:", error);
      alert(error.response?.data?.message || "Failed to create service request");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  return (
    <div className="service-request-container">
      <motion.div
        className="service-request-box"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="service-request-title">Create Service Request</h2>
        <form onSubmit={handleSubmit} className="service-request-form">
          <div className="mb-3">
            <label className="form-label">Service:</label>
            <select
              className="form-select service-request-input"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
            >
              <option value="">Select a service</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="carpentry">Carpentry</option>
              <option value="cleaning">Cleaning</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Description:</label>
            <textarea
              className="form-control service-request-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address:</label>
            <textarea
              className="form-control service-request-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Image (optional):</label>
            <input
              type="file"
              className="form-control service-request-input"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="service-request-preview" />
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Video (optional):</label>
            <input
              type="file"
              className="form-control service-request-input"
              accept="video/mp4"
              onChange={handleVideoChange}
            />
            {videoPreview && (
              <div className="mt-2">
                <video src={videoPreview} controls className="service-request-preview" />
              </div>
            )}
          </div>
          <motion.button
            type="submit"
            className="btn service-request-btn w-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Request
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CustomerServiceRequest;