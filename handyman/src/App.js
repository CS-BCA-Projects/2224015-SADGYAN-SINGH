import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import Home from "./pages/Home";
import Login from "./components/Login.js";
import Register from "./components/Register";
import ForgetPassword from "./components/ForgetPassword";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ServiceProviderDashboard from "./pages/service-provider/ServiceProviderDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerServiceRequest from "./pages/customer/CustomerServiceRequest";
import RequestService from "./pages/customer/RequestService";
import CompletedRequestsCustomer from "./pages/customer/CompletedRequests";
import CompletedRequestsServiceProvider from "./pages/service-provider/CompletedRequests";
import ServiceHistory from "./pages/customer/ServiceHistory";
import AddService from "./pages/service-provider/AddService";
import PendingRequests from "./pages/service-provider/PendingRequests";
import AcceptedRequests from "./pages/service-provider/AcceptedRequests";
import AcceptRequests from "./pages/service-provider/AcceptRequests";
import Notification from "./components/Notification";
import About from "./pages/About";
import "./styles/App.css";
import "./styles/Navbar.css";
import "./index.css";

function App() {
  const getUserFromLocalStorage = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromLocalStorage());
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = getUserFromLocalStorage();
      if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
        setUser(updatedUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange(); // Initial sync

    // Sync on route change
    const handleRouteChange = () => {
      const updatedUser = getUserFromLocalStorage();
      if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
        setUser(updatedUser);
      }
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [user]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Router>
      <div
        className="app min-h-screen bg-dark-bg relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519125323398-675f398f6978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
        <div className="relative z-10">
          <Navbar user={user} setUser={setUser} />
          {notification && (
            <Notification message={notification} onClose={() => setNotification(null)} />
          )}
          <Routes>
            <Route path="/" element={<Home showNotification={showNotification} />} />
            <Route
              path="/login"
              element={
                user ? (
                  user.role === "customer" ? (
                    <Navigate to="/dashboard/customer" replace />
                  ) : user.role === "service-provider" ? (
                    <Navigate to="/dashboard/service-provider" replace />
                  ) : user.role === "admin" ? (
                    <Navigate to="/dashboard/admin" replace />
                  ) : (
                    <Login setUser={setUser} showNotification={showNotification} />
                  )
                ) : (
                  <Login setUser={setUser} showNotification={showNotification} />
                )
              }
            />
            <Route path="/register" element={<Register showNotification={showNotification} />} />
            <Route path="/forget-password" element={<ForgetPassword showNotification={showNotification} />} />
            <Route path="/about" element={<About showNotification={showNotification} />} />

            <Route element={<ProtectedRoute allowedRoles={["customer"]} user={user} />}>
              <Route path="/dashboard/customer" element={<CustomerDashboard showNotification={showNotification} />} />
              <Route path="/dashboard/customer/profile" element={<CustomerProfile showNotification={showNotification} />} />
              <Route path="/dashboard/customer/request-service" element={<CustomerServiceRequest showNotification={showNotification} />} />
              <Route path="/request-service" element={<RequestService showNotification={showNotification} />} />
              <Route path="/completed-requests" element={<CompletedRequestsCustomer showNotification={showNotification} />} />
              <Route path="/service-history" element={<ServiceHistory showNotification={showNotification} />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["service-provider"]} user={user} />}>
              <Route path="/dashboard/service-provider" element={<ServiceProviderDashboard showNotification={showNotification} />} />
              <Route path="/add-service" element={<AddService showNotification={showNotification} />} />
              <Route path="/pending-requests" element={<PendingRequests showNotification={showNotification} />} />
              <Route path="/accept-requests" element={<AcceptRequests showNotification={showNotification} />} />
              <Route path="/accepted-requests" element={<AcceptedRequests showNotification={showNotification} />} />
              <Route path="/completed-requests" element={<CompletedRequestsServiceProvider showNotification={showNotification} />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} user={user} />}>
              <Route path="/dashboard/admin" element={<AdminDashboard showNotification={showNotification} />} />
            </Route>

            <Route path="*" element={<div className="text-center text-white mt-20">404 - Page Not Found</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;