import React from "react";
import axios from "axios";

const ServiceCard = ({ service }) => {
  const token = localStorage.getItem("token");

  const handleBook = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/customers/requests",
        {
          serviceId: service._id,
          description: `Booking for ${service.name}`,
          location: "Default Location", // Replace with actual user input if needed
          urgency: "Medium",
        },
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      alert("Service booked successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Error booking service");
    }
  };

  return (
    <div className="service-card">
      <h2 className="service-title">{service.name}</h2>
      <p className="service-desc">{service.description}</p>
      <p className="service-price">₹{service.price}</p>
      <button className="book-btn" onClick={handleBook}>Book Now</button>
    </div>
  );
};

export default ServiceCard;