// Testimonials.jsx
import React from "react";
import { motion, useAnimation } from "framer-motion";
import { HiChevronLeft, HiChevronRight, HiStar } from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";

/* DATA */
const DATA = [
  { quote: "Debt Protection helped me reduce my debt by 45%! I can finally see light at the end of the tunnel.", name: "Michael J.", place: "New York, NY" },
  { quote: "The process was so simple and the results were amazing. I'm debt-free in just 18 months!", name: "Sarah W.", place: "Los Angeles, CA" },
  { quote: "Professional service from start to finish. They really care about helping people get out of debt.", name: "David C.", place: "Chicago, IL" },
  { quote: "It increased my confidence. Because you were able to identify a problem, set a goal, make a plan and then achieve the goal.", name: "David N., Cat lover, tattoo aficionado" },
  { quote: "I'll tell my story to anyone that wants; I have no shame whatsoever. National Debt Relief saved me so I can live my best life now!", name: "Angelic B., Singer with the St. Louis Symphony" },
  { quote: "Our life started to get less complicated because the burden of debt is hard to carry.", name: "Jaime B., Private pilot, devoted husband" },
];

/* Visible count by breakpoint: sm=1, md=3, lg=4 */
function useVisibleCount() {
  const get = () => {
    if (typeof window === "undefined") return 1;
    if (window.matchMedia("(min-width:1024px)").matches) return 4;
    if (window.matchMedia("(min-width:768px)").matches) return 3;
    return 1;
  };
  const [count, setCount] = React.useState(get);
  React.useEffect(() => {
    const mqLg = window.matchMedia("(min-width:1024px)");
    const mqMd = window.matchMedia("(min-width:768px)");
    const onChange = () => setCount(get());
    mqLg.addEventListener?.("change", onChange);
    mqMd.addEventListener?.("change", onChange);
    mqLg.addListener?.(onChange);
    mqMd.addListener?.(onChange);
    onChange();
    return () => {
      mqLg.removeEventListener?.("change", onChange);
      mqMd.removeEventListener?.("change", onChange);
      mqLg.removeListener?.(onChange);
      mqMd.removeListener?.(onChange);
    };
  }, []);
  return count;
}

/* Card: neutral, minimal, shorter; STARS = YELLOW */
function Card({ quote, name, place, measureRef }) {
  return (
    <div
      ref={measureRef}
      className="
        group relative overflow-hidden rounded-2xl
        border border-slate-200 bg-white
        p-5
        w-[clamp(220px,88vw,260px)] h-[280px]
        sm:w-[clamp(240px,88vw,280px)] sm:h-[300px]
        md:w-[240px] md:h-[280px]
        lg:w-[240px] lg:h-[300px]
        flex flex-col
      "
    >
      <p className="mt-1 text-slate-800 italic leading-relaxed">“{quote}”</p>

      <div className="mt-auto pt-4">
        {/* stars in yellow */}
        <div className="flex items-center gap-1 text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <AiFillStar key={i} className="w-4 h-4" />
          ))}
        </div>
        <div className="mt-2">
          <h4 className="font-extrabold text-slate-900">{name}</h4>
          {place && <span className="text-sm text-slate-600">{place}</span>}
        </div>
      </div>
    </div>
  );
}

/* Slider */
export default function Testimonials() {
  const visibleCount = useVisibleCount(); // 1 | 3 | 4

  // Measure card width (include gap). Use a measurable probe, not sr-only.
  const probeRef = React.useRef(null);
  const [cardW, setCardW] = React.useState(260);
  const GAP = 16; // gap-4

  React.useEffect(() => {
    const el = probeRef.current;
    if (!el) return;

    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setCardW(w);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [visibleCount]);

  const BASE = DATA.length;
  const stepPx = cardW + GAP;
  const fullSetPx = BASE * stepPx;
  const controls = useAnimation();

  // Start centered in middle dataset
  const [offset, setOffset] = React.useState(fullSetPx);
  const DEFAULT_DIR = 1; // left
  const [paused, setPaused] = React.useState(false);
  const pauseRef = React.useRef(null);

  // Keep offset aligned to card boundaries if sizes change
  React.useEffect(() => {
    const alignToStep = (x) => Math.round(x / stepPx) * stepPx;
    setOffset((o) => {
      let normalized = ((o % fullSetPx) + fullSetPx) % fullSetPx;
      normalized = alignToStep(normalized);
      return normalized + fullSetPx;
    });
  }, [fullSetPx, stepPx]);

  // Apply the offset once sizes are known
  React.useEffect(() => {
    controls.set({ x: -offset });
  }, [controls, offset]);

  // One-step anim + seamless wrap (snap to step)
  const animateStep = React.useCallback(
    async (direction) => {
      const next = offset + direction * stepPx;

      await controls.start({
        x: -next,
        transition: { duration: 0.48, ease: [0.22, 0.61, 0.36, 1] },
      });

      let committed = next;
      if (committed >= 2 * fullSetPx) {
        committed -= fullSetPx;
        await controls.set({ x: -committed });
      } else if (committed < 0) {
        committed += fullSetPx;
        await controls.set({ x: -committed });
      }
      setOffset(committed);
    },
    [controls, offset, stepPx, fullSetPx]
  );

  // Auto-advance
  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => animateStep(DEFAULT_DIR), 1200);
    return () => clearInterval(t);
  }, [animateStep, paused]);

  function stepOnce(direction) {
    setPaused(true);
    if (pauseRef.current) clearTimeout(pauseRef.current);
    animateStep(direction).finally(() => {
      pauseRef.current = setTimeout(() => setPaused(false), 1200);
    });
  }

  // Viewport width for exact card(s) with exact gaps between them
  const wrapperWidth = visibleCount * cardW + (visibleCount - 1) * GAP;

  return (
    <section className="py-12 bg-white">
      <div className="container-narrow">
        <div className="text-center max-w-3xl mx-auto">
  <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 bg-[hsla(320,75%,96%,0.9)] border-[hsl(320,70%,86%)] text-[hsl(18,88%,46%)] font-bold text-xs tracking-wide uppercase">
    <HiStar className="text-[hsl(18,88%,56%)]" />
    Success Stories
  </div>
</div>

        {/* Slider */}
        <div className="mt-8 relative">
          {/* Measurable probe: off-flow but sized */}
          <div className="absolute opacity-0 pointer-events-none -z-10">
            <Card {...DATA[0]} measureRef={probeRef} />
          </div>

          {/* Viewport width fixed to 1/3/4 cards */}
          <div
            className="mx-auto overflow-hidden rounded-2xl border border-slate-200"
            style={{ width: wrapperWidth }}
          >
            <motion.ul className="flex gap-4 will-change-transform" animate={controls}>
              {([...DATA, ...DATA, ...DATA]).map((t, i) => (
                <li key={`${t.name}-${i}`} className="shrink-0">
                  <Card {...t} />
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Controls */}
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-full"
            style={{ width: wrapperWidth }}
          >
            <div className="flex items-center justify-between h-full">
              <button
                aria-label="Previous"
                onClick={() => stepOnce(1)}
                className="pointer-events-auto grid place-items-center w-10 h-10 rounded-full border border-slate-300 bg-white text-slate-800"
              >
                <HiChevronLeft className="w-6 h-6" />
              </button>
              <button
                aria-label="Next"
                onClick={() => stepOnce(-1)}
                className="pointer-events-auto grid place-items-center w-10 h-10 rounded-full border border-slate-300 bg-white text-slate-800"
              >
                <HiChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Same blue CTA button AFTER the cards */}
        <div className="mt-6 flex justify-center">
          <a
            href="#quiz"
            className="
              inline-flex items-center justify-center
              px-7 sm:px-8 py-3 rounded-full font-extrabold tracking-wide uppercase
              text-white text-[0.9rem]
              bg-blue-600 hover:bg-blue-700
              shadow-[0_8px_24px_rgba(37,99,235,0.28)]
              hover:shadow-[0_10px_28px_rgba(37,99,235,0.38)]
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300
              transition
            "
          >
            Check Eligibility
          </a>
        </div>
      </div>
    </section>
  );
}
