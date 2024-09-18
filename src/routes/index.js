const express = require("express");
const v1Routes = require("./v1");

// Create an Express router for main routes
const router = express.Router();

// Use v1 routes
router.use("/v1", v1Routes);

// Export the main routes
module.exports = router;
