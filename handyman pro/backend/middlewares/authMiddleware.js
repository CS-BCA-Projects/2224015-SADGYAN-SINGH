const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const tokenHeader = req.header("Authorization");
  console.log("Received Token:", tokenHeader);

  if (!tokenHeader) return res.status(401).json({ msg: "No token, authorization denied" });

  const token = tokenHeader.startsWith("Bearer ") ? tokenHeader.split(" ")[1] : tokenHeader;
  if (!token) return res.status(401).json({ msg: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied: Admins only" });
  }
  next();
};

const serviceProviderMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "service-provider") {
    return res.status(403).json({ msg: "Access denied: Service Providers only" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, serviceProviderMiddleware };