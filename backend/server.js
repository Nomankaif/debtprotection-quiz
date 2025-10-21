// Your imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { submitForm } from "./src/controllers/formController.js";
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
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Form API is running ??"));
app.post("/quiz/api/form/submit", submitForm);


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