const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const { LoggerConfig } = require("./config");

// Creating an Express app instance
const app = express();

// Configuring rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins window
    limit: 20, // 20 requests per window
    message: "Too many requests, try again after 10 mins.", // Error message
});

// Middlewares Configurations
app.use(express.json({ limit: "10kb" })); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cookieParser()); // Parse Cookies
app.use(limiter); // Applying rate limiting
app.use(LoggerConfig.logger); // Custom logger middleware
app.use(
    cors({
        origin: "*", // Allow requests from all origin
        credentials: true, // Allow credentials(eg. cookies)
    })
);

// Root route
app.get("/", (req, res) => {
    res.send("Server is Up and Running Smoothly!");
});

// Exporting the express app instance
module.exports = app;
