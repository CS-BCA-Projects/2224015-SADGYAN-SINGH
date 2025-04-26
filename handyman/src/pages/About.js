import React from "react";
import { motion } from "framer-motion";
import "../styles/About.css";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="about-container"
    >
      <h1 className="about-title">About HandyMan</h1>
      <p className="about-description">
        HandyMan is your trusted partner for all home services. We provide a seamless platform to book skilled professionals for repairs, maintenance, and more. Our key features include:
      </p>
      <ul className="about-features">
        <li>Easy booking for plumbing, electrical, carpentry, and cleaning services.</li>
        <li>Verified and experienced professionals.</li>
        <li>24/7 customer support.</li>
        <li>Transparent pricing with no hidden costs.</li>
        <li>Track your service requests in real-time.</li>
      </ul>
      <p className="about-cta">
        Join us today to experience hassle-free home maintenance!
      </p>
    </motion.div>
  );
};

export default About;