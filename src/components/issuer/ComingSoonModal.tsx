"use client";

import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const iconStroke = 1.75;

type ComingSoonModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  dismissNote?: string;
};

export function ComingSoonModal({
  open,
  onClose,
  title = "Coming Soon",
  description = "AI Asset Intelligence is launching soon. Valuation, risk scoring, yield forecasting, and compliance modules will be available here.",
  dismissNote = "You can still explore the preview below — full access will unlock at launch.",
}: ComingSoonModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coming-soon-title"
        className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl border border-ui-border bg-ui-card/95 p-6 shadow-2xl backdrop-blur-md duration-300 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-ui-muted-text transition-colors hover:bg-ui-muted-deep hover:text-ui-strong"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={iconStroke} />
        </button>

        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" strokeWidth={iconStroke} aria-hidden />
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          AI Intelligence
        </p>
        <h2 id="coming-soon-title" className="pr-8 text-xl font-bold tracking-tight text-ui-strong sm:text-2xl">
          {title}
        </h2>
        <p className="mt-3 text-base font-medium leading-relaxed text-ui-muted-text">
          {description}
        </p>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-gradient-primary w-full rounded-2xl py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            Got it — preview the modules
          </button>
          <p className="text-center text-base font-medium leading-relaxed text-ui-faint">
            {dismissNote}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
