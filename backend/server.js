// backend/server.js

// MODIFY THE ERROR HANDLERS LIKE THIS
process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down...");
  console.error("Reason:", reason);
  setTimeout(() => process.exit(1), 100); // Add a small delay
});

process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err);
  setTimeout(() => process.exit(1), 100); // Add a small delay
});

// ... Your existing code starts below
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import formRoutes from "./src/routes/formRoutes.js";
import connectDB from "./src/config/db.js";

dotenv.config();

// Connect to DB
connectDB();

const app = express();

// ADD THIS MIDDLEWARE
app.use((req, res, next) => {
  console.log(`✅ Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Middleware
const corsOptions = {
  origin: 'https://www.debtprotection.org',
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => res.send("Form API is running 🚀"));
app.use("/api/form", formRoutes);

// Start server
const PORT = process.env.PORT || 1000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
