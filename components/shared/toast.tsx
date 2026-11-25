"use client";

import { useEffect } from "react";

type ToastProps = {
  id: number;
  message: string;
  onDone: (id: number) => void;
  durationMs?: number;
};

/**
 * Small status message at the bottom of the screen. It sits above the
 * fixed bottom bars on mobile and hides itself after `durationMs`.
 */
export function Toast({ id, message, onDone, durationMs = 2800 }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDone(id), durationMs);
    return () => window.clearTimeout(timer);
  }, [id, onDone, durationMs]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(7.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 lg:bottom-8">
      <p
        role="status"
        aria-live="polite"
        className="pointer-events-auto max-w-sm rounded-full bg-slate-900/90 px-5 py-3 text-center text-[14px] font-semibold leading-6 text-white shadow-[0_10px_28px_rgba(15,23,42,0.25)]"
      >
        {message}
      </p>
    </div>
  );
}
