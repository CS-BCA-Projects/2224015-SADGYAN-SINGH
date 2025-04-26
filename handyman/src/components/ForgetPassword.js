import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "../styles/Auth.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/forget-password", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="auth-container">
      {/* Video Background */}
      <video autoPlay loop muted className="background-video">
        <source src="/videos/home-repair.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for Content */}
      <div className="overlay">
        {/* Main Content */}
        <motion.div
          className="auth-left"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="auth-brand">HandyMan</h1>
          <h2 className="auth-tagline">Connecting You to Trusted Services</h2>
        </motion.div>
        <motion.div
          className="auth-right"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="auth-box">
            <h2 className="auth-title">Forget Password</h2>
            <p className="auth-subtitle">
              Enter your email to reset your password. <Link to="/login">Back to Login</Link>
            </p>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control auth-input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="btn auth-btn w-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Reset Link
              </motion.button>
              {message && <p className="mt-3 text-center" style={{ color: message.includes("Failed") ? "#e53e3e" : "#2ecc71" }}>{message}</p>}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgetPassword;