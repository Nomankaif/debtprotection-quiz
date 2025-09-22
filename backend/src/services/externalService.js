// backend/src/services/externalService.js
import axios from "axios";
import { externalApis } from "../config/externalAPIs.js";

export const pushToExternalApis = async (submission) => {
  const results = [];

  for (const api of externalApis) {
    try {
      const payload = api.mapPayload(submission);
      const headers =
        typeof api.headers === "function"
          ? api.headers(submission)
          : api.headers;

      const res = await axios.post(api.url, payload, { headers });

      console.log(`✅ Sent to ${api.name}:`, res.status);
      results.push({ api: api.name, status: "success", code: res.status });
    } catch (err) {
      console.error(`❌ Error sending to ${api.name}:`, err.message);
      results.push({ api: api.name, status: "error", error: err.message });
    }
  }

  return results;
};
