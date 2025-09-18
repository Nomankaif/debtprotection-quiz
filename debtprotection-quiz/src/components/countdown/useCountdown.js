import { useEffect, useRef, useState } from "react";

/**
 * Returns { d,h,m,s } that tick each second. Session-persistent end time.
 * Default: 1d 11h 24m 11s
 */
const DEFAULT_MS = (1 * 24 * 60 * 60 + 11 * 60 * 60 + 24 * 60 + 11) * 1000; // 127,451,000 ms
const STORAGE_KEY = "dp_endtime_1d11h24m11s"; // new key to avoid old cached end time

export default function useCountdown(initialMs = DEFAULT_MS) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const timerRef = useRef(null);

  useEffect(() => {
    const now = Date.now();
    let end = parseInt(sessionStorage.getItem(STORAGE_KEY) || "", 10);
    if (!end || Number.isNaN(end) || end < now) {
      end = now + initialMs;
      sessionStorage.setItem(STORAGE_KEY, String(end));
    }

    const tick = () => {
      const remaining = Math.max(0, end - Date.now());
      const total = Math.floor(remaining / 1000);
      const d = Math.floor(total / 86400);
      const h = Math.floor((total % 86400) / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;

      setTime((prev) =>
        prev.d === d && prev.h === h && prev.m === m && prev.s === s
          ? prev
          : { d, h, m, s }
      );

      if (remaining <= 0 && timerRef.current) clearInterval(timerRef.current);
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [initialMs]);

  return time;
}
