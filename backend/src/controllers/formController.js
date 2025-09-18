import {FormSubmission} from "../models/FormSubmission.js";
import { pushToExternalApis } from "../services/externalService.js";

export const submitForm = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is empty. Did you send JSON?",
      });
    }

    const {
      debtAmount,
      assets = [],
      employmentStatus = "",
      struggles = [],
      debtTypes = [],
      zipcode,
      phone = "",
      countryCode = "",
      firstName = "",
      lastName = "",
      email,
      option, // must be explicitly provided
      submissionMetadata = {},
    } = req.body;

    // Check required fields
    if (!debtAmount || !email || !firstName || !lastName || !zipcode || option !== true) {
      return res.status(400).json({
        message: "Missing or invalid required fields",
        required: ["debtAmount", "firstName", "lastName", "email", "zipcode", "option=true"],
        received: { debtAmount, firstName, lastName, email, zipcode, option },
      });
    }

    // Normalize struggles
    const normalizedStruggles =
      struggles.includes("all") && struggles.length === 1
        ? ["high-interest", "min-payments", "multiple-cards", "medical-debt"]
        : struggles;

    // Guarantee arrays not empty (to prevent validator errors)
    const safeAssets = assets.length > 0 ? assets : ["none"];
    const safeDebtTypes = debtTypes.length > 0 ? debtTypes : ["other"];
    const safeStruggles = normalizedStruggles.length > 0 ? normalizedStruggles : ["high-interest"];

    const payload = {
      debtAmount,
      assets: safeAssets,
      employmentStatus,
      struggles: safeStruggles,
      debtTypes: safeDebtTypes,
      zipcode,
      phone,
      countryCode,
      firstName,
      lastName,
      email,
      option, // required true
      submissionMetadata,
    };

    // Save to DB
    const newSubmission = new FormSubmission(payload);
    await newSubmission.save();

    // Push to external APIs
    let externalResults = [];
    try {
      externalResults = await pushToExternalApis(newSubmission.toObject());
    } catch (apiErr) {
      console.error("⚠️ External API push failed:", apiErr.message);
      externalResults = [{ error: apiErr.message }];
    }

    return res.status(201).json({
      message: "Form submitted successfully ✅",
      id: newSubmission._id,
      external: externalResults,
    });
  } catch (error) {
    console.error("❌ Error in submitForm:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid form data",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Unexpected server error",
      error: error.message,
    });
  }
};
