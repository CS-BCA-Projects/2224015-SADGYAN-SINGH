import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Auth.css";

const Register = ({ showNotification }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [experience, setExperience] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
        phoneNumber,
        address: role === "customer" ? address : undefined,
        experience: role === "service-provider" ? experience : undefined,
      });
      localStorage.setItem("token", response.data.token);
      // Save user data to localStorage
      const userData = {
        name: response.data.name,
        role: response.data.role,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      showNotification(response.data.msg);
      navigate(role === "customer" ? "/dashboard/customer" : "/dashboard/service-provider");
    } catch (error) {
      console.error("Error registering:", error);
      console.log("Error response:", error.response?.data);
      showNotification(error.response?.data?.msg || "Failed to register");
    }
  };

  return (
    <div className="auth-container">
      <video autoPlay loop muted className="background-video">
        <source src="/videos/home-repair.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay">
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
            <h2 className="auth-title">Create an Account</h2>
            <p className="auth-subtitle">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control auth-input"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control auth-input"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
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
              <div className="mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="auth-eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="mb-3">
                <select
                  className="form-select auth-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="service-provider">Service Provider</option>
                </select>
              </div>
              {role === "customer" && (
                <div className="mb-3">
                  <textarea
                    className="form-control auth-input"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              )}
              {role === "service-provider" && (
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control auth-input"
                    placeholder="Experience (e.g., 5 years)"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                  />
                </div>
              )}
              <motion.button
                type="submit"
                className="btn auth-btn w-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Account
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;