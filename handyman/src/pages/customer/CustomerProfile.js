import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../styles/Dashboard.css";

const CustomerProfile = ({ showNotification }) => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/customers/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setEditedProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      }
    };
    fetchProfile();
  }, [token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/customers/profile",
        editedProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(editedProfile);
      setIsEditing(false);
      showNotification("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      showNotification("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard-container">
      <motion.div
        className="dashboard-box"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="dashboard-title">Customer Profile</h2>
        {error && <p className="dashboard-error">{error}</p>}
        {Object.keys(profile).length === 0 ? (
          <p className="dashboard-empty">No profile data found.</p>
        ) : (
          <div className="dashboard-card">
            {isEditing ? (
              <>
                <div className="mb-3">
                  <label className="block mb-1">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editedProfile.name || ""}
                    onChange={handleChange}
                    className="form-control auth-input w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={editedProfile.email || ""}
                    onChange={handleChange}
                    className="form-control auth-input w-full"
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Phone Number:</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editedProfile.phoneNumber || ""}
                    onChange={handleChange}
                    className="form-control auth-input w-full"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1">Address:</label>
                  <textarea
                    name="address"
                    value={editedProfile.address || ""}
                    onChange={handleChange}
                    className="form-control auth-input w-full"
                  />
                </div>
                <motion.button
                  className="dashboard-btn mr-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                >
                  Save
                </motion.button>
                <motion.button
                  className="dashboard-btn bg-gray-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </motion.button>
              </>
            ) : (
              <>
                <p className="dashboard-card-title">Name: {profile.name}</p>
                <p className="dashboard-card-text">Email: {profile.email}</p>
                <p className="dashboard-card-text">Phone Number: {profile.phoneNumber}</p>
                <p className="dashboard-card-text">Address: {profile.address}</p>
                <p className="dashboard-card-text">Role: {profile.role}</p>
                <motion.button
                  className="dashboard-btn mt-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                >
                  Edit Profile
                </motion.button>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CustomerProfile;