// debtprotection-quiz/src/components/StickyNotice.jsx
import React from "react";

export default function StickyNotice() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const id = setTimeout(() => setVisible(true), 3000); // show after 3 seconds
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-2 bottom-2 sm:right-4 sm:bottom-4 md:right-5 md:bottom-5
                  w-[90vw] sm:w-[min(80vw,18rem)] md:w-auto
                  max-w-[17rem] sm:max-w-[22rem] md:max-w-md
                  rounded-xl border border-slate-200 bg-white/95 backdrop-blur
                  px-4 py-3 sm:px-5 sm:py-3 text-[12px] sm:text-sm md:text-base text-slate-800
                  shadow-[0_8px_24px_rgba(0,0,0,0.24)]
                  ${
                    visible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }
                  transition-all duration-300 z-[60]`}
    >
      ⚠️ <strong>Updated September 17, 2025</strong>: Free debt evaluations
      filling fast. Check eligibility before spots close.
    </div>
  );
}
