require("dotenv").config();
console.log("Loaded .env:", process.env); // Debug log to check env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { ObjectId } = mongoose.Types;

// Import authRoutes
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Create uploads directories if they don't exist
if (!fs.existsSync("uploads/images")) {
  fs.mkdirSync("uploads/images", { recursive: true });
}
if (!fs.existsSync("uploads/videos")) {
  fs.mkdirSync("uploads/videos", { recursive: true });
}

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "uploads/images/");
    } else if (file.fieldname === "video") {
      cb(null, "uploads/videos/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for files
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "image") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed for image field"));
      }
    } else if (file.fieldname === "video") {
      if (!file.mimetype.startsWith("video/")) {
        return cb(new Error("Only video files are allowed for video field"));
      }
    }
    cb(null, true);
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Models
const User = require("./models/User");
const Customer = require("./models/Customer");
const ServiceProvider = require("./models/ServiceProvider");
const Service = require("./models/Service");
const ServiceRequest = require("./models/ServiceRequest");
const ServiceAccept = require("./models/ServiceAccept");

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired. Please log in again." });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Routes
app.use("/api/auth", authRoutes);

// Get all services
app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find().populate("providerId", "name email");
    res.json(services);
  } catch (error) {
    console.error("Error in services route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Get service provider's requests
app.get("/api/service-providers/requests", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "service-provider") {
      return res.status(403).json({ message: "Access denied" });
    }
    const requests = await ServiceRequest.find({ status: "pending" })
      .populate("customerId", "name phoneNumber")
      .populate("serviceId", "name description price");
    res.json(requests);
  } catch (error) {
    console.error("Error in requests route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Get service provider's services
app.get("/api/service-providers/services", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "service-provider") {
      return res.status(403).json({ message: "Access denied" });
    }
    const services = await Service.find({ providerId: req.user.id });
    res.json(services);
  } catch (error) {
    console.error("Error in services route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Add a service
app.post("/api/service-providers/services", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "service-provider") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields (name, description, price, category) are required" });
    }

    const service = new Service({
      name,
      description,
      price: Number(price),
      category,
      providerId: new mongoose.Types.ObjectId(req.user.id),
    });
    await service.save();
    res.status(201).json({ message: "Service added successfully" });
  } catch (error) {
    console.error("Error in add service route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Accept a request
app.post("/api/service-providers/accept-request", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "service-provider") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { requestId } = req.body;
    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }
    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    request.status = "accepted";
    request.providerId = new ObjectId(req.user.id);
    await request.save();
    console.log("Request updated:", request);

    const notification = new ServiceAccept({
      requestId: new ObjectId(requestId),
      customerId: new ObjectId(request.customerId),
      providerId: new ObjectId(req.user.id),
      status: "accepted",
    });
    await notification.save();
    console.log("Notification saved:", notification);

    res.json({ message: "Request accepted successfully" });
  } catch (error) {
    console.error("Error in accept request route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Additional endpoints for service providers
app.get("/api/service-providers/pending-requests", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "service-provider") {
      return res.status(403).json({ message: "Access denied" });
    }
    const pendingRequests = await ServiceRequest.find({ status: "pending" })
      .populate("customerId", "name phoneNumber")
      .populate("serviceId", "name description price");
    res.json(pendingRequests);
  } catch (error) {
    console.error("Error in pending requests route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

app.get("/api/service-providers/completed-requests", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "service-provider") {
      return res.status(403).json({ message: "Access denied" });
    }
    const completedRequests = await ServiceRequest.find({ status: "completed", providerId: req.user.id })
      .populate("customerId", "name phoneNumber")
      .populate("serviceId", "name description price");
    res.json(completedRequests);
  } catch (error) {
    console.error("Error in completed requests route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

app.get("/api/service-providers/accepted-requests", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "service-provider") {
      return res.status(403).json({ message: "Access denied" });
    }
    const requests = await ServiceRequest.find({
      providerId: req.user.id,
      status: "accepted",
    })
      .populate("customerId", "name email phoneNumber")
      .populate("serviceId", "name description price");
    res.json(requests);
  } catch (error) {
    console.error("Error in service provider accepted requests route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Customer notifications
app.get("/api/customers/notifications", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }
    // Find requests directly using req.user.id
    const customerRequests = await ServiceRequest.find({ customerId: req.user.id });
    console.log("Customer Requests:", customerRequests); // Debug log
    const requestIds = customerRequests.map(request => request._id);
    console.log("Request IDs:", requestIds); // Debug log

    if (requestIds.length === 0) {
      return res.json([]); // Return empty array if no requests found
    }

    const notifications = await ServiceAccept.find({ requestId: { $in: requestIds } })
      .populate("providerId", "name email phoneNumber experience")
      .populate("requestId", "description status"); // Specify fields for requestId
    console.log("Notifications:", notifications); // Debug log

    res.json(notifications);
  } catch (error) {
    console.error("Error in customer notifications route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Customer requests
app.get("/api/customers/requests", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }
    // Remove Customer lookup since customerId in ServiceRequest is directly the User ID
    const requests = await ServiceRequest.find({ customerId: req.user.id })
      .populate({
        path: "serviceId",
        select: "name description price",
        options: { strictPopulate: false },
      })
      .populate({
        path: "providerId",
        select: "name phoneNumber experience",
        options: { strictPopulate: false },
      });

    const sanitizedRequests = requests.map((request) => ({
      ...request.toObject(),
      serviceId: request.serviceId || { name: "Unknown", description: "N/A", price: 0 },
      providerId: request.providerId || { name: "Unknown", phoneNumber: "N/A", experience: "N/A" },
    }));

    res.json(sanitizedRequests);
  } catch (error) {
    console.error("Error in customer requests route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Create a new service request
app.post("/api/customers/requests", authenticateToken, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ message: err.message });
    }
    try {
      if (req.user.role !== "customer") {
        return res.status(403).json({ message: "Access denied" });
      }
      const { serviceId, description, address } = req.body;

      if (!serviceId || !description || !address) {
        return res.status(400).json({ message: "Service ID, description, and address are required" });
      }

      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const imagePath = req.files?.image ? req.files.image[0].path : null;
      const videoPath = req.files?.video ? req.files.video[0].path : null;

      const request = new ServiceRequest({
        customerId: new mongoose.Types.ObjectId(req.user.id),
        serviceId: new mongoose.Types.ObjectId(serviceId),
        description,
        address,
        image: imagePath,
        video: videoPath,
        status: "pending",
      });
      await request.save();

      res.status(201).json({ message: "Service request created successfully" });
    } catch (error) {
      console.error("Error in create service request route:", error);
      res.status(500).json({ message: "Server error: " + error.message });
    }
  });
});

// Complete request
app.post("/api/customers/complete-request", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { requestId } = req.body;
    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }
    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    const customer = await Customer.findOne({ userId: req.user.id });
    if (!customer || request.customerId.toString() !== customer._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to complete this request" });
    }
    if (request.status !== "accepted") {
      return res.status(400).json({ message: "Only accepted requests can be marked as completed" });
    }
    request.status = "completed";
    await request.save();
    res.json({ message: "Request marked as completed" });
  } catch (error) {
    console.error("Error in complete request route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Customer Profile Routes
app.get("/api/customers/profile", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }
    const customer = await Customer.findOne({ userId: req.user.id }).populate("userId");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({
      name: customer.name,
      email: customer.userId.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
    });
  } catch (error) {
    console.error("Error in customer profile route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

app.put("/api/customers/profile", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { name, phoneNumber, address } = req.body;
    const customer = await Customer.findOneAndUpdate(
      { userId: req.user.id },
      { name, phoneNumber, address },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error in update profile route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Admin Routes
app.get("/api/admin/users", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const users = await User.find();
    const customers = await Customer.find();
    const serviceProviders = await ServiceProvider.find();
    const allUsers = users.map((user) => {
      if (user.role === "customer") {
        const customer = customers.find((c) => c.userId.toString() === user._id.toString());
        return {
          _id: user._id,
          name: customer?.name || "Unknown",
          email: user.email,
          role: user.role,
          phoneNumber: customer?.phoneNumber || "N/A",
        };
      } else if (user.role === "service-provider") {
        const provider = serviceProviders.find((p) => p.userId.toString() === user._id.toString());
        return {
          _id: user._id,
          name: provider?.name || "Unknown",
          email: user.email,
          role: user.role,
          phoneNumber: provider?.phoneNumber || "N/A",
        };
      }
      return {
        _id: user._id,
        name: "Admin",
        email: user.email,
        role: user.role,
        phoneNumber: "N/A",
      };
    });
    res.json(allUsers);
  } catch (error) {
    console.error("Error in admin users route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

app.delete("/api/admin/users/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "customer") {
      await Customer.deleteOne({ userId: user._id });
    } else if (user.role === "service-provider") {
      await ServiceProvider.deleteOne({ userId: user._id });
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in delete user route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

app.get("/api/admin/services", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error("Error in admin services route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

app.delete("/api/admin/services/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    await Service.deleteOne({ _id: req.params.id });
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error in delete service route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

app.get("/api/admin/requests", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const requests = await ServiceRequest.find()
      .populate("customerId", "name")
      .populate("serviceId", "name")
      .populate("providerId", "name");
    res.json(requests);
  } catch (error) {
    console.error("Error in admin requests route:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Serve Frontend
const buildPath = path.join(__dirname, 'build');
console.log("Serving static files from:", buildPath); // Debug log
if (!fs.existsSync(buildPath)) {
  console.error("Build folder does not exist at:", buildPath);
} else {
  console.log("Build folder exists. Contents:", fs.readdirSync(buildPath));
}

app.use(express.static(buildPath));

// Handle React routing for Single Page Application (SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error("index.html not found at:", indexPath);
    return res.status(404).send("index.html not found in build folder");
  }
  res.sendFile(indexPath);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ 🚀 Server running on port ${PORT}`));