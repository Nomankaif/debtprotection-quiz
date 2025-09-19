// server.js
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

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => res.send("Form API is running 🚀"));
app.use("/api/form", formRoutes);

// Start server
const PORT = process.env.PORT || 1000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
