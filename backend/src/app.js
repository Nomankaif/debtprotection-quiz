import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import formRoutes from "./routes/formRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB()

const app = express();
app.use(cors({
  origin: 'https://debtprotection.org',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Form API is running 🚀"));
app.use("/api/form", formRoutes);

export default app;
