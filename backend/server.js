// backend/server.js

// Error Handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("?? UNHANDLED REJECTION! Shutting down...");
  console.error("Reason:", reason);
  setTimeout(() => process.exit(1), 100); // Add a small delay
});

process.on("uncaughtException", (err) => {
  console.error("?? UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err);
  setTimeout(() => process.exit(1), 100); // Add a small delay
});

// Your imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import formRoutes from "./src/routes/formRoutes.js";
import connectDB from "./src/config/db.js";

dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Logging Middleware
app.use((req, res, next) => {
  console.log(`? Incoming Request: ${req.method} ${req.url}`);
  next();
});

// CORS Configuration
const corsOptions = {
  origin: "https://www.debtprotection.org",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Form API is running ??"));
app.use("/api/form", formRoutes);

// Catch-all 404 Handler for debugging
app.use((req, res, next) => {
  console.log(`? 404 Handler Triggered for URL: ${req.originalUrl}`);
  res.status(404).send("Route does not exist.");
});

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`?? Server running at http://0.0.0.0:${PORT}`);
});
