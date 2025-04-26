import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/Dashboard.css";

const RequestService = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: "",
    description: "",
    address: "",
    image: null,
    video: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services");
        setServices(response.data);
      } catch (err) {
        setError("Failed to fetch services");
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("serviceId", formData.serviceId);
    data.append("description", formData.description);
    data.append("address", formData.address);
    if (formData.image) data.append("image", formData.image);
    if (formData.video) data.append("video", formData.video);

    try {
      await axios.post("http://localhost:5000/api/customers/requests", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Service request submitted successfully!");
      setError("");
      setTimeout(() => {
        navigate("/dashboard/customer");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="card w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-accent-gold mb-6 text-center">
          Request a Service
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serviceId" className="block text-gray-700 mb-1">
              Select Service
            </label>
            <select
              id="serviceId"
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue"
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} - ₹{service.price}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue"
              rows="4"
              placeholder="Describe your issue..."
              required
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue"
              placeholder="Enter your address"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-gray-700 mb-1">
              Upload Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              accept="image/*"
            />
          </div>
          <div>
            <label htmlFor="video" className="block text-gray-700 mb-1">
              Upload Video (Optional)
            </label>
            <input
              type="file"
              id="video"
              name="video"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              accept="video/*"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full btn bg-accent-blue text-white"
          >
            Submit Request
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default RequestService;