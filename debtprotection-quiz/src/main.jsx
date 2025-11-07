// debtprotection-quiz/src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter
    basename="/quiz"
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <App />
  </BrowserRouter>
);
