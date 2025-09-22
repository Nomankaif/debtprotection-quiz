// debtprotection-quiz/src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 header-blur"
      style={{ ["--header-h"]: "70px" }}
    >
      <div className="container-narrow">
        <div className="flex items-center justify-between gap-2 h-[var(--header-h)]">
          {/* Brand (clickable logo) */}
          <Link
            to="/"
            className="block group relative"
            title="debtprotection.org"
            aria-label="Debt Protection Home"
          >
            <motion.img
              src={`${import.meta.env.BASE_URL}images/debt_protection.png`}
              alt="Debt Protection"
              className="w-[clamp(160px,32vw,190px)] relative z-10"
              whileHover={{ y: -1.5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 24 }}
            />
            {/* soft glow underline on hover (md+) */}
            <span className="hidden md:block pointer-events-none absolute left-0 right-0 bottom-0 translate-y-2 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="block mx-auto w-3/5 h-full rounded-full blur-md bg-[linear-gradient(90deg,hsl(320,82%,82%),hsl(18,88%,78%),hsl(280,75%,78%))]" />
            </span>
          </Link>

          {/* spacer to keep logo position consistent */}
          <div aria-hidden className="w-[44px] md:w-[0px]" />
        </div>
      </div>
    </header>
  );
}
