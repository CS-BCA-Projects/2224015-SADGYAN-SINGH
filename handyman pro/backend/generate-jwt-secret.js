const crypto = require("crypto");

// Generate a 32-byte random string and convert it to hexadecimal
const jwtSecret = crypto.randomBytes(32).toString("hex");
console.log("Generated JWT_SECRET:", jwtSecret);