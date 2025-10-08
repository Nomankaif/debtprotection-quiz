// backend/src/models/FormSubmission.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const debtFormSubmissionSchema = new Schema(
  {
    // Step 1: Debt Amount (Dropdown)
    debtAmount: {
      type: String,
      required: [true, "Debt amount is required."],
      enum: [
        "0-4999",
        "5000-7499", 
        "7500-9999",
        "10000-14999",
        "15000-19999",
        "20000-29999",
        "30000-39999",
        "40000-49999",
        "50000-59999",
        "60000-69999",
        "70000-79999",
        "80000-89999",
        "90000-99999",
        "100000+"
      ],
    },

    // Step 2: Assets (Checkbox)
    assets: {
      type: [
        {
          type: String,
          enum: ["house", "car", "land-property", "investments", "none"],
        },
      ],
      validate: [
        (val) => val.length > 0,
        "At least one asset option must be selected.",
      ],
    },

    // Step 3: Employment Status (Radio)
    employmentStatus: {
      type: String,
      required: [true, "Employment status is required."],
      enum: [
        "full-time",
        "part-time",
        "self-employed",
        "unemployed",
        "retired",
        "student",
      ],
    },

    // Step 4: Struggles (Checkbox)
    struggles: {
      type: [
        {
          type: String,
          enum: [
            "high-interest",
            "min-payments",
            "multiple-cards",
            "medical-debt",
            "all",
          ],
        },
      ],
      validate: [
        (val) => val.length > 0,
        "At least one struggle must be selected.",
      ],
    },

    // Step 5: Debt Types (Checkbox)
    debtTypes: {
      type: [
        {
          type: String,
          enum: [
            "credit-cards",
            "personal-loans",
            "student-loans",
            "medical-bills",
            "auto-loans",
            "taxes",
            "other",
          ],
        },
      ],
      validate: [
        (val) => val.length > 0,
        "At least one debt type must be selected.",
      ],
    },

    // Step 6: Contact Information
    zipcode: {
      type: String,
      required: [true, "Zip code is required."],
      match: [/^[0-9]{5}$/, "Please fill a valid 5-digit zip code."],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      // A simple regex to catch most digit-based phone numbers
      match: [/^[0-9]{9,10}$/, "Please fill a valid phone number."],
    },
    countryCode: {
      type: String,
      required: [true, "Country code is required."],
      enum: ["+91", "+1", "+44", "+61", "+49", "+33"],
    },

    // Step 7: Personal Information
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,24}$/,
        "Please fill a valid email address.",
      ],
    },
    option: {
      type: Boolean,
      required: true,
      validate: [
        (val) => val === true,
        "User must agree to marketing communications.",
      ],
    },

    // Metadata captured on submission
    submissionMetadata: {
      pageUrl: String,
      referrer: String,
      userAgent: String,
      dwellTimeMs: Number,
      interactionCount: Number,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

export const FormSubmission = mongoose.model(
  "formsubmits",
  debtFormSubmissionSchema
);
