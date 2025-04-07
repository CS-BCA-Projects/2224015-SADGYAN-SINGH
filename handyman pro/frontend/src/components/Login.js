import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import animationData from "../assets/animation.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Auth.css";

const Login = ({ setUser, showNotification }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      const user = await axios.get("http://localhost:5000/api/auth/profile", { // Changed /user to /profile
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
      localStorage.setItem("user", JSON.stringify(user.data));
      setUser(user.data);
      showNotification("Login successful!");
      navigate(user.data.role === "customer" ? "/dashboard/customer" : user.data.role === "service-provider" ? "/dashboard/service-provider" : "/dashboard/admin");
    } catch (error) {
      console.error("Error logging in:", error);
      showNotification(error.response?.data?.message || "Failed to login");
    }
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-left"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="auth-brand">HandyMan</h1>
        <h2 className="auth-tagline">Connecting You to Trusted Services</h2>
        <Lottie options={lottieOptions} height={300} width={300} />
      </motion.div>
      <motion.div
        className="auth-right"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="auth-box">
          <h2 className="auth-title">Log In</h2>
          <p className="auth-subtitle">
            Don't have an account? <Link to="/register">Create one</Link>
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
            <motion.button
              type="submit"
              className="btn auth-btn w-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Log In
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;