// backend/src/services/externalService.js
import axios from "axios";
import { externalApis } from "../config/externalAPIs.js";


export const pushToExternalApis = async (submission) => {
  console.log("[external] External API pushing is temporarily disabled.");
  return []; // nothing sent, nothing logged as result
};

// export const pushToExternalApis = async (submission) => {
//   const results = [];

//   for (const api of externalApis) {
//     // Skip disabled APIs
//     if (api.enabled === false) {
//       console.log(`[external] Skipping disabled API ${api.name}`);
//       continue;
//     }

//     try {
//       const payload = api.mapPayload(submission);
//       const headers =
//         typeof api.headers === "function"
//           ? api.headers(submission)
//           : api.headers;

//       // Mock path: do not call network, just echo a simulated success
//       if (api.mock === true || !api.url) {
//         console.log(`[external] Mocking ${api.name} (no network call)`);
//         console.log(`[external] -> Payload: ${JSON.stringify(payload, null, 2)}`);
//         const mockId = `mock_${api.name}_${Date.now()}`;
//         const mockData = { id: mockId, receivedAt: new Date().toISOString() };
//         results.push({ api: api.name, status: "mock", code: 200, data: mockData });
//         continue;
//       }

//       // Real network call (only if enabled and URL present)
//       console.log(`[external] Sending to ${api.name}...`);
//       console.log(`[external] -> URL: ${api.url}`);
//       console.log(`[external] -> Payload: ${JSON.stringify(payload, null, 2)}`);
//       console.log(`[external] -> Headers: ${JSON.stringify(headers, null, 2)}`);

//       const res = await axios.post(api.url, payload, { headers });

//       console.log(`[external] <- ${api.name} responded with ${res.status}`);
//       results.push({ api: api.name, status: "success", code: res.status });
//     } catch (err) {
//       console.error(`[external] Error sending to ${api.name}:`, err.message);
//       if (err.response) {
//         console.error(`[external] Response Status: ${err.response.status}`);
//         console.error(`[external] Response Data:`, err.response.data);
//         console.error(`[external] Response Headers:`, err.response.headers);
//       }
//       results.push({
//         api: api.name,
//         status: "error",
//         error: err.message,
//         statusCode: err.response?.status,
//         responseData: err.response?.data,
//       });
//     }
//   }

//   return results;
// };
