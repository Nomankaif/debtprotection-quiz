// LimitedOffer.jsx
import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import useCountdown from "./countdown/useCountdown.js";
import { HiOutlineClock } from "react-icons/hi";

/* utils */
const two = (n) => String(n).padStart(2, "0");

/* FlipTile */
function FlipTile({ value, label }) {
  const display = two(value);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative" style={{ perspective: "1000px" }} aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={display}
          initial={prefersReducedMotion ? { opacity: 0 } : { rotateX: -180, opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { rotateX: 0, opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { rotateX: 180, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          className="
            relative overflow-hidden rounded-2xl border
            bg-white
            border-[hsl(320,70%,86%)]
            shadow-[0_8px_18px_rgba(2,6,23,0.10)]
            px-3 py-2 sm:px-4 sm:py-4
          "
        >
          <div
            className="
              relative z-[1] font-extrabold tabular-nums leading-none tracking-tight
              text-[hsl(18,88%,46%)]
              text-[clamp(1.05rem,6.2vw,1.45rem)] sm:text-[clamp(1.4rem,5.5vw,2.1rem)]
              text-center
            "
            style={{ minWidth: "2ch" }}
          >
            {display}
          </div>

          <div
            className="
              relative z-[1] mt-0.5 sm:mt-1
              text-[clamp(0.55rem,2.6vw,0.72rem)] sm:text-[clamp(0.7rem,2.5vw,0.9rem)]
              font-semibold text-slate-700 text-center uppercase tracking-wide
            "
          >
            {label}
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[hsla(18,88%,58%,0.20)]"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const DEFAULT_MS = (1*24*60*60 + 11*60*60 + 24*60 + 11) * 1000; // 1d 11h 24m 11s

/* LimitedOffer — centered; order: chip then timer; plain light background */
export default function LimitedOffer() {
  // Hook expects a duration; default is 1d 11h 24m 11s
  const { d, h, m, s } = useCountdown(); // or useCountdown(DEFAULT_MS)

  const srText = `Time left: ${d} days, ${h} hours, ${m} minutes, ${s} seconds`;

  return (
    <section className="relative overflow-hidden py-12 sm:py-14 border-y bg-white">
      <div className="container-narrow">
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
          {/* 1) Clock chip */}
          <div
            className="
              inline-flex items-center gap-2 rounded-full border px-3 py-1.5
              bg-white border-[hsl(320,70%,86%)]
              text-[hsl(18,88%,46%)] font-bold text-[11px] sm:text-xs tracking-wide uppercase
            "
            aria-label="Limited time window"
          >
            <HiOutlineClock className="shrink-0" />
            Limited window
          </div>

          {/* 2) Timer card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="
              mt-6 w-full
              rounded-2xl border border-[hsl(320,70%,86%)] bg-white
              shadow-[0_8px_18px_rgba(2,6,23,0.08)]
              p-3 sm:p-5 text-center
            "
          >
            <div className="font-bold text-slate-900 mb-2 sm:mb-3 text-sm sm:text-base">
              Limited Spots Available this Month. <br />Check if you qualify before time runs out:
            </div>

            {/* Single ARIA live region for SR users */}
            <div role="timer" aria-live="polite" className="sr-only">
              {srText}
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 place-items-center pt-4 mb-4">
              <FlipTile value={d} label="Days" />
              <FlipTile value={h} label="Hours" />
              <FlipTile value={m} label="Minutes" />
              <FlipTile value={s} label="Seconds" />
            </div>

            <a
              href="#quiz"
              className="
                mt-5 inline-flex items-center justify-center
                px-7 sm:px-8 py-3 rounded-full font-extrabold tracking-wide uppercase
                text-white text-[0.9rem]
                bg-blue-600 hover:bg-blue-700
                shadow-[0_8px_24px_rgba(180,40,140,0.28)]
                hover:shadow-[0_10px_28px_rgba(180,40,140,0.38)]
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300
                transition
                mb-2
              "
            >
              Check Eligibility
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
