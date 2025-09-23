// debtprotection-quiz/src/pages/Loading.jsx
import React, { useEffect } from "react";

export default function Loading() {
  useEffect(() => {
     window.scrollTo(0, 0);
    const t = setTimeout(() => {
      window.location.href =
        "https://trk.trkclix.net/click?campaign_id=35&pub_id=57";
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-[60vh] grid place-items-center p-10">
      <div className="grid place-items-center text-center">
        <img
          src={`${import.meta.env.BASE_URL}images/buffer.gif`}
          alt="Loading..."
          width="160"
          height="160"
          className="mb-4"
        />
        <p className="text-slate-600">
          Please wait, we’re finding the best program available for you...
        </p>
      </div>
    </main>
  );
}
