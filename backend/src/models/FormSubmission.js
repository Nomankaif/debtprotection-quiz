// backend/src/models/FormSubmission.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const debtFormSubmissionSchema = new Schema(
  {
    // Step 1: Debt Amount (Slider)
    debtAmount: {
      type: Number,
      required: [true, "Debt amount is required."],
      min: [1000, "Debt amount must be at least $1,000."],
      max: [100000, "Debt amount cannot exceed $100,000."],
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
