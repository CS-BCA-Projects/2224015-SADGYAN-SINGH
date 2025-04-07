import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Navbar.css";

const Navbar = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
    }
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full bg-white shadow-lg z-50"
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-purple-500">
          HandyMan
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-purple-500 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`md:flex md:space-x-6 items-center ${
            isMenuOpen ? "block" : "hidden"
          } md:block absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none`}
        >
          {user ? (
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
              <span className="text-gray-700">Welcome, {user.name}</span>
              {user.role === "customer" && (
                <>
                  <Link
                    to="/dashboard/customer"
                    className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/customer/profile"
                    className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/request-service"
                    className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Make Request
                  </Link>
                  <Link
                    to="/completed-requests"
                    className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Completed Requests
                  </Link>
                  <Link
                    to="/service-history"
                    className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Service History
                  </Link>
                </>
              )}
              {user.role === "service-provider" && (
                <>
                  <Link
                    to="/dashboard/service-provider"
                    className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/pending-requests"
                    className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pending Requests
                  </Link>
                  <Link
                    to="/accept-requests"
                    className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Accept Requests
                  </Link>
                  <Link
                    to="/accepted-requests"
                    className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Accepted Requests
                  </Link>
                  <Link
                    to="/completed-requests"
                    className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Completed Requests
                  </Link>
                  <Link
                    to="/add-service"
                    className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Add Service
                  </Link>
                </>
              )}
              {user.role === "admin" && (
                <Link
                  to="/dashboard/admin"
                  className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="dashboard-btn bg-red-500 hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
              <Link
                to="/login"
                className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
              <Link
                to="/forget"
                className="text-purple-500 hover:text-purple-600 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Forget Password
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;