"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { InvestorNavIcon, type InvestorNavIconId } from "@/components/InvestorNavIcons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import { UserProfileMenu } from "@/components/UserProfileMenu";

type NavItem = {
  name: string;
  href: string;
  icon: InvestorNavIconId;
  tag?: string;
};

const NAV_SCROLL_KEY = 'investor-sidebar-scroll';

export default function InvestorLayout({
  children,
  pageTitle,
}: {
  children: React.ReactNode;
  pageTitle?: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const sidebarLogoSrc = theme === "dark" ? "/lightlogo.png" : "/darklogo.png";
  const navRef = useRef<HTMLElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  // Persist scroll position while the user scrolls
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const handleScroll = () => {
      sessionStorage.setItem(NAV_SCROLL_KEY, String(nav.scrollTop));
    };
    nav.addEventListener('scroll', handleScroll, { passive: true });
    return () => nav.removeEventListener('scroll', handleScroll);
  }, []);

  // On every navigation: restore saved scroll, then scroll active item into
  // view only if it is outside the currently visible area.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const saved = Number(sessionStorage.getItem(NAV_SCROLL_KEY) ?? 0);
    nav.scrollTop = saved;

    const activeEl = activeItemRef.current;
    if (activeEl) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      const isVisible = itemRect.top >= navRect.top && itemRect.bottom <= navRect.bottom;
      if (!isVisible) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [pathname]);

  const investorItems: NavItem[] = [
    { name: "Overview", href: "/investor/overview", icon: "overview" },
    { name: "Investor Hub", href: "/investor/hub", icon: "hub", tag: "NEW" },
    { name: "Marketplace", href: "/investor/marketplace", icon: "marketplace" },
    { name: "Secondary Market", href: "/investor/secondary-market", icon: "secondary-market" },
    { name: "My Portfolio", href: "/investor/portfolio", icon: "portfolio" },
    { name: "Wallet", href: "/investor/wallet", icon: "wallet" },
    { name: "Documents", href: "/investor/documents", icon: "documents" },
  ];
  const supportItems: NavItem[] = [
    { name: "Help Center", href: "/investor/help", icon: "help" },
  ];

  const allItems = [...investorItems, ...supportItems];
  const currentPage =
    pageTitle ||
    allItems.find((item) => item.href === pathname)?.name ||
    "Investor Hub";

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground antialiased transition-colors duration-300">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="motion-overlay fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside
          className={`motion-sidebar sidebar-gradient fixed lg:sticky top-0 h-screen lg:max-h-screen flex flex-col w-64 shrink-0 border-r border-ui-border shadow-[2px_0_24px_-12px_rgba(15,23,42,0.06)] z-[70] dark:shadow-[2px_0_24px_-12px_rgba(0,0,0,0.45)] ${
            isMobileMenuOpen ? "is-open translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo row — same height + border as main header; logo centered in sidebar strip */}
          <div className="relative flex h-17 shrink-0 items-center justify-center border-b border-ui-border px-4">
            {isMobileMenuOpen && (
              <button
                type="button"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-ui-muted-text transition-colors hover:text-ui-strong lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <Link
              href="/investor/overview"
              className="relative mx-auto block h-8 w-[200px] max-w-[calc(100%-2.5rem)] sm:h-9 sm:w-[210px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src={sidebarLogoSrc}
                alt="Maxtronize"
                fill
                className="object-contain object-center"
                sizes="210px"
                priority
              />
            </Link>
          </div>

          {/* Nav */}
          <nav ref={navRef} className="motion-sidebar-nav scrollbar-hide flex-1 space-y-8 overflow-y-auto px-4 pb-4 pt-5">
            <div className="space-y-1">
              <div className="mb-2 flex flex-col px-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ui-faint">Investor</p>
                <div className="nav-category-rule w-full" />
              </div>
              {investorItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    ref={isActive ? activeItemRef : undefined}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`motion-nav-link relative flex w-full items-center gap-3 rounded-2xl py-3 pl-4 pr-3 ${
                      isActive
                        ? "nav-active-glow text-primary font-bold"
                        : "text-ui-muted-text hover:bg-ui-muted-deep hover:text-ui-strong"
                    }`}
                  >
                    <InvestorNavIcon
                      id={item.icon}
                      className={isActive ? "text-primary" : "text-ui-muted-text"}
                    />
                    <span className={`flex-1 truncate text-base ${isActive ? "font-bold text-primary" : "font-medium text-ui-body"}`}>
                      {item.name}
                    </span>
                    {item.tag ? (
                      <span className="shrink-0 rounded-md bg-ui-muted-deep px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ui-muted-text">
                        {item.tag}
                      </span>
                    ) : isActive ? (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_0_3px_rgba(124,58,237,0.2)] dark:shadow-[0_0_0_3px_rgba(167,139,250,0.25)] animate-pulse" aria-hidden />
                    ) : null}
                  </Link>
                );
              })}
            </div>

            <div className="space-y-1">
              <div className="mb-2 flex flex-col px-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ui-faint">Support</p>
                <div className="nav-category-rule w-full" />
              </div>
              {supportItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    ref={isActive ? activeItemRef : undefined}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`motion-nav-link relative flex w-full items-center gap-3 rounded-2xl py-3 pl-4 pr-3 ${
                      isActive
                        ? "nav-active-glow text-primary font-bold"
                        : "text-ui-muted-text hover:bg-ui-muted-deep hover:text-ui-strong"
                    }`}
                  >
                    <InvestorNavIcon
                      id={item.icon}
                      className={isActive ? "text-primary" : "text-ui-muted-text"}
                    />
                    <span className={`flex-1 truncate text-base ${isActive ? "font-bold text-primary" : "font-medium text-ui-body"}`}>
                      {item.name}
                    </span>
                    {isActive ? (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_0_3px_rgba(124,58,237,0.2)] dark:shadow-[0_0_0_3px_rgba(167,139,250,0.25)] animate-pulse" aria-hidden />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-ui-border p-5 pt-6 space-y-4">
            <div className="hidden rounded-xl status-glass-badge p-4 lg:block">
              <div className="mb-1.5 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-ui-success-icon shadow-[0_0_8px_rgba(16,185,129,0.45)]" />
                <p className="text-xs font-bold uppercase tracking-widest text-ui-success-text">All systems operational</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:hidden">
              <div className="flex items-center justify-between gap-3 px-1">
                <span className="text-xs font-bold uppercase tracking-widest text-ui-faint">Appearance</span>
                <ThemeToggle />
              </div>
              <UserProfileMenu variant="mobile" />
            </div>

            <div className="hidden lg:block">
              <UserProfileMenu variant="sidebar" />
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-ui-page">
          <header className="motion-header header-glass sticky top-0 z-40 flex h-17 shrink-0 items-center justify-between gap-4 border-b border-ui-border px-4 sm:px-6 md:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                className="shrink-0 text-ui-muted-text transition-colors hover:text-ui-strong lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <nav
                className="flex min-w-0 items-center gap-2 text-base sm:text-base"
                aria-label="Breadcrumb"
              >
                <span className="shrink-0 font-medium text-ui-placeholder">Platform</span>
                <span className="breadcrumb-sep shrink-0 font-medium text-ui-faint" aria-hidden>
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="min-w-0 truncate font-semibold text-ui-strong">{currentPage}</span>
              </nav>
            </div>

            <div className="hidden shrink-0 items-center gap-1 sm:gap-2 md:gap-3 lg:flex">
              <div className="mx-1 hidden h-8 w-px shrink-0 bg-ui-border sm:block" aria-hidden />
              <UserProfileMenu variant="header" />
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-ui-page p-5 sm:p-6 md:p-8">
            <div key={pathname} className="motion-page-content animate-page-enter">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
