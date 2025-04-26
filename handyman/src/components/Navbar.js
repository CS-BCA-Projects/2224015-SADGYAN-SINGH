import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Navbar.css";

const Navbar = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure user prop is always used, no local override
    if (!user && localStorage.getItem("user")) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    }
  }, [user, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuVariants = {
    open: { x: 0, transition: { duration: 0.3 } },
    closed: { x: "-100%", transition: { duration: 0.3 } },
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full bg-white shadow-lg z-50"
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link to="/" className="text-2xl font-bold text-purple-500">
          HandyMan
        </Link>
        <button onClick={toggleMenu} className="text-black focus:outline-none z-50">
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
        <motion.div
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={menuVariants}
          className="fixed top-0 left-0 h-full w-64 bg-black text-white shadow-lg z-40"
        >
          <div className="p-4">
            <button onClick={toggleMenu} className="text-white focus:outline-none mb-4">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {user ? (
              <div className="flex flex-col space-y-2">
                <span className="text-white mb-2">Welcome, {user.name}</span>
                {user.role === "customer" && (
                  <>
                    <Link
                      to="/dashboard/customer"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/customer/request-service"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Service Request
                    </Link>
                    <Link
                      to="/service-history"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Service History
                    </Link>
                    <Link
                      to="/completed-requests"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Completed Requests
                    </Link>
                    <Link
                      to="/dashboard/customer/profile"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dashboard-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mt-2 text-left"
                    >
                      Logout
                    </button>
                  </>
                )}
                {user.role === "service-provider" && (
                  <>
                    <Link
                      to="/dashboard/service-provider"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/add-service"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Add Service
                    </Link>
                    <Link
                      to="/pending-requests"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Pending Requests
                    </Link>
                    <Link
                      to="/accept-requests"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Accept Requests
                    </Link>
                    <Link
                      to="/accepted-requests"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Accepted Requests
                    </Link>
                    <Link
                      to="/completed-requests"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Completed Requests
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dashboard-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mt-2 text-left"
                    >
                      Logout
                    </button>
                  </>
                )}
                {user.role === "admin" && (
                  <>
                    <Link
                      to="/dashboard/admin"
                      className="text-white hover:text-purple-300 transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dashboard-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mt-2 text-left"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="text-white hover:text-purple-300 transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:text-purple-300 transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
                <Link
                  to="/about"
                  className="text-white hover:text-purple-300 transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  About Website
                </Link>
              </div>
            )}
          </div>
        </motion.div>
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleMenu}
          ></div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;