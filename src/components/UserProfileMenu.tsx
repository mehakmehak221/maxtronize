"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";

const iconStroke = 1.75;

type UserProfileMenuProps = {
  variant?: "sidebar" | "header" | "mobile";
  name?: string;
  email?: string;
  signOutHref?: string;
};

function ProfileAvatar({
  gradientId,
  size = "md",
}: {
  gradientId: string;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const ringClass = size === "sm" ? "" : "ring-2 ring-sidebar-bg";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border border-ui-border bg-ui-muted-deep ${sizeClass} ${ringClass}`}
    >
      <svg className="h-full w-full" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect width="80" height="80" fill={`url(#${gradientId})`} />
        <ellipse cx="40" cy="72" rx="26" ry="20" fill="#cbd5e1" />
        <circle cx="40" cy="34" r="16" fill="#94a3b8" />
        <defs>
          <linearGradient id={gradientId} x1="40" y1="0" x2="40" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fafc" />
            <stop offset="1" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function UserProfileMenu({
  variant = "header",
  name = "Alex Chen",
  email = "alex@maxtronize.com",
  signOutHref = "/signin",
}: UserProfileMenuProps) {
  const router = useRouter();
  const uid = useId().replace(/:/g, "");
  const gradientId = `profileAvatarGrad-${uid}`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || (variant !== "header" && variant !== "mobile")) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, variant]);

  const handleSignOut = () => {
    setOpen(false);
    signOut();
    router.replace(signOutHref);
  };

  if (variant === "sidebar") {
    return (
      <div className="flex items-center gap-3 rounded-xl p-1.5">
        <ProfileAvatar gradientId={gradientId} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold text-ui-strong">{name}</p>
          <p className="truncate text-[11px] text-ui-muted-text">{email}</p>
        </div>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group flex w-full items-center gap-3 rounded-xl border border-ui-border bg-ui-card p-3 text-left shadow-sm transition-colors hover:bg-ui-muted-deep"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Account menu"
        >
          <ProfileAvatar gradientId={gradientId} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-ui-strong">{name}</p>
            <p className="truncate text-[11px] text-ui-muted-text">{email}</p>
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-ui-faint transition-transform group-hover:text-ui-muted-text ${
              open ? "rotate-180" : ""
            }`}
            strokeWidth={iconStroke}
            aria-hidden
          />
        </button>

        {open ? (
          <div
            role="menu"
            className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-ui-border bg-ui-card py-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[13px] font-medium text-ui-body transition-colors hover:bg-ui-muted-deep hover:text-ui-strong"
            >
              <LogOut className="h-4 w-4 shrink-0 text-ui-muted-text" strokeWidth={iconStroke} aria-hidden />
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex items-center gap-2 rounded-full border border-ui-border bg-ui-card py-1 pl-1 pr-2.5 shadow-sm transition-colors hover:bg-ui-muted-deep sm:gap-2.5 sm:pr-3"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <ProfileAvatar gradientId={gradientId} size="sm" />
        <span className="hidden max-w-[120px] truncate text-[13px] font-semibold text-ui-strong sm:inline md:max-w-[160px]">
          {name}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ui-faint transition-transform group-hover:text-ui-muted-text ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={iconStroke}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-ui-border bg-ui-card py-1 shadow-lg"
        >
          <div className="border-b border-ui-divider px-3 py-2.5">
            <p className="truncate text-[11px] text-ui-muted-text">{email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[13px] font-medium text-ui-body transition-colors hover:bg-ui-muted-deep hover:text-ui-strong"
          >
            <LogOut className="h-4 w-4 shrink-0 text-ui-muted-text" strokeWidth={iconStroke} aria-hidden />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
