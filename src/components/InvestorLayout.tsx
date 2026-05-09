"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MaxtronizeLogo } from "@/components/MaxtronizeLogo";

export default function InvestorLayout({
  children,
  pageTitle,
}: {
  children: React.ReactNode;
  pageTitle?: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const investorItems = [
    { name: "Overview", icon: "⊞", href: "/investor/overview" },
    { name: "Investor Hub", icon: "🏛", tag: "NEW", href: "/investor/hub" },
    { name: "Marketplace", icon: "◈", href: "/investor/marketplace" },
    { name: "Secondary Market", icon: "↗", href: "/investor/secondary-market" },
    { name: "My Portfolio", icon: "📁", href: "/investor/portfolio" },
    { name: "Wallet", icon: "💳", href: "/investor/wallet" },
    { name: "Documents", icon: "📄", href: "/investor/documents" },
  ];
  const supportItems = [
    { name: "Help Center", icon: "💡", href: "/investor/help" },
  ];

  const allItems = [...investorItems, ...supportItems];
  const currentPage =
    pageTitle ||
    allItems.find((item) => item.href === pathname)?.name ||
    "Investor Hub";

  return (
    <div className="relative flex min-h-screen flex-col bg-ui-page text-foreground transition-colors duration-300">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 h-screen lg:max-h-screen flex flex-col w-64 shrink-0 border-r border-ui-border bg-sidebar-bg shadow-[2px_0_24px_-12px_rgba(15,23,42,0.06)] transition-all duration-300 z-[70] dark:shadow-[2px_0_24px_-12px_rgba(0,0,0,0.45)] ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo row */}
          <div className="flex shrink-0 items-center justify-between border-b border-ui-border px-5 pb-6 pt-8 md:px-6">
            <Link href="/investor/overview" className="block min-w-0 max-w-[180px]" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative h-8 w-full">
                <MaxtronizeLogo fill sizes="180px" className="object-contain object-left" />
              </div>
            </Link>
            {isMobileMenuOpen && (
              <button
                type="button"
                className="shrink-0 text-ui-muted-text lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Nav */}
          <nav className="scrollbar-hide flex-1 space-y-8 overflow-y-auto px-4 pb-4 pt-5">
            <div className="space-y-1">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ui-faint">Investor</p>
                <Link
                  href="/issuer/dashboard"
                  className="rounded-md border border-primary/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/5"
                >
                  Switch
                </Link>
              </div>
              {investorItems.map((item, i) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative flex w-full items-center gap-3 rounded-2xl py-3 pl-4 pr-3 transition-colors duration-150 ${
                      isActive
                        ? "border-l-[4px] border-primary bg-ui-accent-tint text-primary shadow-[inset_0_0_0_1px_rgba(124,58,237,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(167,139,250,0.12)]"
                        : "border-l-[4px] border-transparent text-ui-muted-text hover:bg-ui-muted-deep hover:text-ui-strong"
                    }`}
                  >
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className={`flex-1 truncate text-[13px] ${isActive ? "font-bold text-primary" : "font-medium text-ui-body"}`}>
                      {item.name}
                    </span>
                    {item.tag ? (
                      <span className="shrink-0 rounded-md border border-ui-border bg-ui-muted-deep px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-ui-body">
                        {item.tag}
                      </span>
                    ) : isActive ? (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_0_3px_rgba(124,58,237,0.2)] dark:shadow-[0_0_0_3px_rgba(167,139,250,0.25)]" aria-hidden />
                    ) : null}
                  </Link>
                );
              })}
            </div>

            <div className="space-y-1">
              <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ui-faint">Support</p>
              {supportItems.map((item, i) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative flex w-full items-center gap-3 rounded-2xl py-3 pl-4 pr-3 transition-colors duration-150 ${
                      isActive
                        ? "border-l-[4px] border-primary bg-ui-accent-tint text-primary"
                        : "border-l-[4px] border-transparent text-ui-muted-text hover:bg-ui-muted-deep hover:text-ui-strong"
                    }`}
                  >
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className={`text-[13px] ${isActive ? "font-bold text-primary" : "font-medium text-ui-body"}`}>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-ui-border p-5 pt-6 space-y-4">
            <div className="hidden rounded-xl border border-ui-success-border/70 bg-ui-success-bg-soft p-4 lg:block">
              <div className="mb-1.5 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-ui-success-icon shadow-[0_0_8px_rgba(16,185,129,0.45)]" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-ui-success-text">All systems operational</p>
              </div>
              <p className="text-[9px] font-medium leading-relaxed text-ui-success-text/90">99.98% uptime · Blockchain synced</p>
            </div>
            <button
              type="button"
              className="group flex w-full cursor-pointer items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-ui-muted-deep"
              aria-haspopup="menu"
            >
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-ui-border bg-ui-muted-deep ring-2 ring-sidebar-bg">
                <svg className="h-full w-full" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect width="80" height="80" fill="url(#invAvatarGrad)" />
                  <ellipse cx="40" cy="72" rx="26" ry="20" fill="#cbd5e1" />
                  <circle cx="40" cy="34" r="16" fill="#94a3b8" />
                  <defs>
                    <linearGradient id="invAvatarGrad" x1="40" y1="0" x2="40" y2="80" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f8fafc" /><stop offset="1" stopColor="#e2e8f0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-ui-strong">Alex Chen</p>
                <p className="truncate text-[11px] text-ui-muted-text">alex@maxtronize.com</p>
              </div>
              <svg className="h-4 w-4 shrink-0 text-ui-faint transition-transform group-hover:text-ui-muted-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-ui-border bg-sidebar-bg px-4 backdrop-blur-sm sm:px-6 md:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                className="shrink-0 text-ui-muted-text lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:gap-x-3 sm:text-sm">
                <span className="shrink-0 font-medium text-ui-muted-text">Platform</span>
                <span className="shrink-0 text-ui-faint">›</span>
                <span className="min-w-0 truncate font-bold text-foreground">{currentPage}</span>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-ui-success-border/50 bg-ui-success-bg-soft px-2 py-0.5 text-[10px] font-bold text-ui-success-icon">
                  <span className="h-1.5 w-1.5 rounded-full bg-ui-success-icon" aria-hidden />
                  Live
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
              <button type="button" className="relative text-ui-muted-text transition-colors hover:text-foreground" aria-label="Notifications">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-sidebar-bg bg-primary" aria-hidden />
              </button>
              <button type="button" className="hidden text-ui-muted-text transition-colors hover:text-foreground sm:block" aria-label="Settings">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <div className="hidden h-8 w-px shrink-0 bg-ui-border sm:block" aria-hidden />
              <div className="flex items-center gap-2 rounded-xl border border-ui-border bg-ui-elevated py-1 pl-1 pr-3 shadow-sm">
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-ui-border bg-ui-muted-deep">
                  <svg className="h-full w-full" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect width="80" height="80" fill="url(#invHeaderAvatarGrad)" />
                    <ellipse cx="40" cy="72" rx="26" ry="20" fill="#cbd5e1" />
                    <circle cx="40" cy="34" r="16" fill="#94a3b8" />
                    <defs>
                      <linearGradient id="invHeaderAvatarGrad" x1="40" y1="0" x2="40" y2="80" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#f8fafc" /><stop offset="1" stopColor="#e2e8f0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="hidden text-sm font-semibold text-ui-strong sm:inline">Alex Chen</span>
              </div>
              <div className="flex items-center [&_button]:p-1">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 bg-ui-page p-6 md:p-8">
            <div key={pathname} className="animate-page-enter">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
