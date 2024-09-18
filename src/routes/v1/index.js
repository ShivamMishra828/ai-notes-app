const express = require("express");
const authRoutes = require("./auth-routes");

// Create an Express router for v1 routes
const router = express.Router();

// Use authentication routes
router.use("/auth", authRoutes);

// Export the v1 routes
module.exports = router;
