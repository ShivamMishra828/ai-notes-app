const express = require("express");
const authRoutes = require("./auth-routes");
const noteRoutes = require("./note-routes");

// Create an Express router for v1 routes
const router = express.Router();

// Use authentication routes
router.use("/auth", authRoutes);

// Use notes routes
router.use("/notes", noteRoutes);

// Export the v1 routes
module.exports = router;
