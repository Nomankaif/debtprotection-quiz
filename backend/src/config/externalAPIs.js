// backend/src/config/externalAPIs.js

const debtRanges = [
  { key: "0-4999", min: 0, max: 4999, label: "$0 - $4,999" },
  { key: "5000-7499", min: 5000, max: 7499, label: "$5,000 - $7,499" },
  { key: "7500-9999", min: 7500, max: 9999, label: "$7,500 - $9,999" },
  { key: "10000-14999", min: 10000, max: 14999, label: "$10,000 - $14,999" },
  { key: "15000-19999", min: 15000, max: 19999, label: "$15,000 - $19,999" },
  { key: "20000-29999", min: 20000, max: 29999, label: "$20,000 - $29,999" },
  { key: "30000-39999", min: 30000, max: 39999, label: "$30,000 - $39,999" },
  { key: "40000-49999", min: 40000, max: 49999, label: "$40,000 - $49,999" },
  { key: "50000-59999", min: 50000, max: 59999, label: "$50,000 - $59,999" },
  { key: "60000-69999", min: 60000, max: 69999, label: "$60,000 - $69,999" },
  { key: "70000-79999", min: 70000, max: 79999, label: "$70,000 - $79,999" },
  { key: "80000-89999", min: 80000, max: 89999, label: "$80,000 - $89,999" },
  { key: "90000-99999", min: 90000, max: 99999, label: "$90,000 - $99,999" },
  { key: "100000+", min: 100000, max: Infinity, label: "$100,000+" },
];

const debtKeyToLabel = debtRanges.reduce((acc, range) => {
  acc[range.key] = range.label;
  return acc;
}, {});

const toSafeNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (value === null || value === undefined) {
    return null;
  }

  const stringValue = String(value).trim();

  if (stringValue === "") {
    return null;
  }

  const rangeDefinition = debtRanges.find((range) => range.key === stringValue);
  if (rangeDefinition) {
    return rangeDefinition.min;
  }

  const match = stringValue.match(/\d+/);
  if (!match) {
    return null;
  }

  const parsed = Number.parseInt(match[0], 10);
  return Number.isNaN(parsed) ? null : parsed;
};

// Converts the UI value into the formatted string the partner expects.
export const mapDebtRange = (value) => {
  if (value === null || value === undefined) {
    return "Prefer not to say";
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      return "Prefer not to say";
    }
    if (debtKeyToLabel[trimmed]) {
      return debtKeyToLabel[trimmed];
    }
    const numeric = toSafeNumber(trimmed);
    return numeric === null ? "Prefer not to say" : mapDebtRange(numeric);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const match = debtRanges.find(
      (range) => value >= range.min && value <= range.max
    );
    return match ? match.label : value >= 100000 ? "$100,000+" : "Prefer not to say";
  }

  return "Prefer not to say";
};

const normalizePhone = (phone) => {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  return digits.length >= 10 ? digits : digits;
};

export const externalApis = [
  {
    name: "NDR API",
    url: "https://api.daperformancegroup.com/ndr/42619/",
    headers: () => {
      const apiKey =
        process.env["X-API-KEY"] ??
        process.env.X_API_KEY ??
        process.env.NDR_API_KEY ??
        "";

      if (!apiKey) {
        console.warn("[NDR API] X-API-KEY is not configured in the environment.");
      }
      return {
        "Content-Type": "application/json",
        Accept: "*/*",
        "User-Agent": "DebtProtectionQuiz/1.0",
        "X-API-KEY": apiKey,
      };
    },
    mapPayload: (submission) => {
      const payload = {
        firstname: submission.firstName,
        lastname: submission.lastName,
        email: submission.email,
        phone: normalizePhone(submission.phone),
        zip: submission.zipcode,
        debt: mapDebtRange(submission.debtAmount),
      };

      if (process.env.NDR_PID || submission.pid) {
        payload.pid = submission.pid ?? process.env.NDR_PID;
      }
      if (process.env.NDR_SUBID1 || submission.subid1) {
        payload.subid1 = submission.subid1 ?? process.env.NDR_SUBID1;
      }
      if (process.env.NDR_SUBID2 || submission.subid2) {
        payload.subid2 = submission.subid2 ?? process.env.NDR_SUBID2;
      }

      return payload;
    },
  },

];
