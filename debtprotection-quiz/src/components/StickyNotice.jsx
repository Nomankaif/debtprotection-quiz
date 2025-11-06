import React from "react";
import { X } from "lucide-react"; // ✅ Lucide close icon
 
export default function StickyNotice() {
  const [visible, setVisible] = React.useState(false);
  const [closed, setClosed] = React.useState(false);
 
  // Get yesterday's date (e.g., "October 13, 2025")
  const getYesterdayDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
 
  React.useEffect(() => {
    const id1 = setTimeout(() => setVisible(true), 3000);
    const id2 = setTimeout(() => setVisible(false), 10000);
    return () => {
      clearTimeout(id1);
      clearTimeout(id2);
    };
  }, []);
 
  if (closed) return null;
 
  return (
<div
      className={`fixed right-3 bottom-3 md:right-5 md:bottom-5 
                  transition-all duration-300 z-[60]
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
>
      {/* Sticky Notice Card */}
<div
        role="status"
        aria-live="polite"
        className="relative rounded-xl border border-slate-200 bg-white/95 backdrop-blur
                   px-3.5 py-2.5 text-[13px] sm:text-sm text-slate-800
                   shadow-[0_8px_24px_rgba(0,0,0,0.24)]
                   w-[min(92vw,17rem)] sm:w-auto max-w-[17rem] sm:max-w-[22rem] md:max-w-md"
>
        ⚠️ <strong>Updated {getYesterdayDate()}</strong>: Get your Debt Protection quote today — spots are filling quickly!
 
        {/* Close Button (outside, top-right corner) */}
<button
          onClick={() => setClosed(true)}
          className="absolute -top-3.5 -right-2 bg-white border border-slate-200 rounded-full shadow-sm 
                     p-1 sm:p-1.5 md:p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 active:scale-95
                     transition duration-150 touch-manipulation"
          aria-label="Close notice"
>
<X size={16} strokeWidth={2} />
</button>
</div>
</div>
  );
}