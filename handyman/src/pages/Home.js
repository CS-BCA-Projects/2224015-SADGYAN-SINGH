import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import "../styles/Home.css";

// Import Lottie JSON files from src/assets
import plumbingAnimation from "../assets/plumbing.json";
import electricalAnimation from "../assets/electrical.json";
import carpentryAnimation from "../assets/carpentry.json";
import cleaningAnimation from "../assets/cleaning.json";

const Home = () => {
  const [showServices, setShowServices] = useState(false); // State for toggling services

  const services = [
    {
      name: "Plumbing",
      description: "Fix leaks, install pipes, and more with our expert plumbers.",
      animation: plumbingAnimation,
    },
    {
      name: "Electrical",
      description: "Solve wiring issues and installations with our skilled electricians.",
      animation: electricalAnimation,
    },
    {
      name: "Carpentry",
      description: "Custom furniture and repairs by our experienced carpenters.",
      animation: carpentryAnimation,
    },
    {
      name: "Cleaning",
      description: "Deep cleaning services for your home or office.",
      animation: cleaningAnimation,
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, rotate: 2, transition: { duration: 0.3 } },
  };

  const lottieVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const toggleServices = () => {
    setShowServices(!showServices);
  };

  return (
    <div className="home-container">
      <motion.div
        className="home-header"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="home-title">Welcome to HandyMan</h1>
        <p className="home-tagline">
          Your one-stop solution for all home services. Book trusted professionals for repairs, maintenance, and more.
        </p>
        <button onClick={toggleServices} className="home-btn">
          {showServices ? "Hide Services" : "Our Services"}
        </button>
      </motion.div>

      {showServices && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5 }}
          className="home-services"
        >
          <h2 className="home-subtitle">Our Services</h2>
          <div className="home-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="home-card"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <motion.div
                  className="home-card-animation"
                  variants={lottieVariants}
                  whileHover="hover"
                >
                  <Lottie
                    animationData={service.animation}
                    loop={true}
                    autoplay={true}
                    style={{ width: "200px", height: "200px" }}
                  />
                </motion.div>
                <h3 className="home-card-title">{service.name}</h3>
                <p className="home-card-text">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;