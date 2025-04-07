import React from "react"; // Remove useState import
import { motion } from "framer-motion";

const Notification = ({ message, onClose }) => {
  return (
    <motion.div
      className="notification"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <p>{message}</p>
      <button onClick={onClose} className="notification-close">
        ×
      </button>
    </motion.div>
  );
};

export default Notification;