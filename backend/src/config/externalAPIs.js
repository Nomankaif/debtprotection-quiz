// ---- Debt Range Converter ----
function mapDebtRange(amount) {
  if (amount >= 0 && amount <= 4999) return "$0 - $4,999";
  if (amount >= 5000 && amount <= 9999) return "$5,000 - $9,999";
  if (amount >= 10000 && amount <= 19999) return "$10,000 - $19,999";
  if (amount >= 20000 && amount <= 29999) return "$20,000 - $29,999";
  if (amount >= 30000 && amount <= 39999) return "$30,000 - $39,999";
  if (amount >= 40000 && amount <= 49999) return "$40,000 - $49,999";
  if (amount >= 50000 && amount <= 74999) return "$50,000 - $74,999";
  if (amount >= 75000 && amount <= 99999) return "$75,000 - $99,999";
  if (amount >= 100000) return "$100,000+";
  return "Prefer not to say";
}

// ---- External API Config ----
export const externalApis = [
  /*{
    name: "DAPerformanceAPI",
    url: "https://api.daperformancegroup.com/ndr/42424/",
    headers: () => ({
      "Content-Type": "application/json",
    }),
    mapPayload: (submission) => {
      return {
        firstname: submission.firstname,
        lastname: submission.lastname,
        email: submission.email,
        phone: submission.phone,
        zip: submission.zipCode,
        debt: mapDebtRange(Number(submission.debtAmount)),
        subid: submission.subid || "",
        subid2: submission.subid2 || "",
      };
    },
  },*/
   {
    name: "BeeceptorMockAPI",
    url: "https://mp9ba419c2cf2f062247.free.beeceptor.com",
    headers: () => ({
      "Content-Type": "application/json",
    }),
    mapPayload: (submission) => {
      return {
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email,
        phone: submission.phone,
        zipCode: submission.zipcode,
        countryCode: submission.countryCode,
        debtAmount: submission.debtAmount,
        debtRange: mapDebtRange(Number(submission.debtAmount)),
        assets: submission.assets,
        employmentStatus: submission.employmentStatus,
        struggles: submission.struggles,
        debtTypes: submission.debtTypes,
        option: submission.option,
        submissionMetadata: submission.submissionMetadata,
      };
    },
  },
];
