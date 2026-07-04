'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { MaxtronizeLogo } from './MaxtronizeLogo';
import { IssuerNavIcon, type IssuerNavIconId } from './IssuerNavIcons';
import { UserProfileMenu } from '@/components/UserProfileMenu';

const TOKENIZE_ONBOARDING_HREF = '/issuer/onboarding?start=1';

type NavTag = 'NEW' | 'AI';

type NavItem = {
  name: string;
  href: string;
  icon: IssuerNavIconId;
  tag?: NavTag;
};

const NAV_SCROLL_KEY = 'dashboard-sidebar-scroll';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
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

    // Check visibility of the active item after restoring scroll
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

  const menuItems: { category: string; items: NavItem[] }[] = [
    {
      category: 'PLATFORM',
      items: [
        { name: 'Dashboard', icon: 'dashboard', href: '/issuer/dashboard' },
        { name: 'Issuer Hub', icon: 'hub', tag: 'NEW', href: '/issuer/hub' },
        // Keep AI Intelligence visible in navigation even while some AI flows remain preview-oriented.
        { name: 'AI Intelligence', icon: 'ai', tag: 'AI', href: '/issuer/ai-intelligence' },
        { name: 'Portfolio', icon: 'portfolio', href: '/issuer/portfolio' },
        // { name: 'Investors', icon: 'investors', href: '/issuer/investors' },
        { name: 'Yield', icon: 'yield', href: '/issuer/yield' },
        { name: 'Wallet', icon: 'wallet', href: '/issuer/wallet' },
        { name: 'Documents', icon: 'documents', href: '/issuer/documents' },
      ],
    },
    {
      category: 'SUPPORT',
      items: [{ name: 'Help Center', icon: 'help', href: '/issuer/help-center' }],
    },
  ];

  const allItems = menuItems.flatMap(cat => cat.items);
  const extraTitles: Record<string, string> = {
    '/issuer/onboarding': 'Tokenize Asset',
  };
  const currentPage =
    allItems.find(item => item.href === pathname)?.name ?? extraTitles[pathname] ?? 'Dashboard';
  return (
    <div className="relative flex h-dvh min-h-0 max-h-dvh flex-col overflow-hidden bg-background text-foreground antialiased transition-colors duration-300">
      {isMobileMenuOpen && (
        <div
          className="motion-overlay fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside
          className={`motion-sidebar sidebar-gradient fixed top-0 z-[70] flex h-screen w-64 shrink-0 flex-col border-r border-ui-border shadow-[2px_0_24px_-12px_rgba(15,23,42,0.06)] dark:shadow-[2px_0_24px_-12px_rgba(0,0,0,0.45)] lg:sticky lg:max-h-screen lg:translate-x-0 ${
            isMobileMenuOpen ? 'is-open translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
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
              href="/issuer/dashboard"
              className="relative mx-auto block h-8 w-[200px] max-w-[calc(100%-2.5rem)] sm:h-9 sm:w-[210px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MaxtronizeLogo fill sizes="210px" className="object-contain object-center" priority />
            </Link>
          </div>

          <div className="px-4 pb-2 pt-4">
            <Link
              href={TOKENIZE_ONBOARDING_HREF}
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-press btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-brand-indigo py-3.5 text-base font-bold text-white shadow-[0_12px_32px_-10px_rgba(91,33,182,0.55)] transition-all hover:brightness-[1.05] dark:shadow-[0_12px_32px_-12px_rgba(124,58,237,0.45)]"
            >
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 4v16m8-8H4" />
              </svg>
              <span>Tokenize Asset</span>
            </Link>
          </div>

          <nav ref={navRef} className="motion-sidebar-nav scrollbar-hide flex-1 space-y-8 overflow-y-auto px-4 pb-4 pt-2">
            {menuItems.map((category, idx) => (
              <div key={idx} className="space-y-1">
                <div className="mb-2 flex flex-col px-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ui-faint">{category.category}</p>
                  <div className="nav-category-rule w-full" />
                </div>
                <div className="space-y-1">
                  {category.items.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={i}
                        ref={isActive ? activeItemRef : undefined}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`motion-nav-link relative flex w-full items-center gap-3 rounded-2xl py-3 pl-4 pr-3 ${
                          isActive
                            ? 'nav-active-glow text-primary font-bold'
                            : 'text-ui-muted-text hover:bg-ui-muted-deep hover:text-ui-strong'
                        }`}
                      >
                        <IssuerNavIcon
                          id={item.icon}
                          className={isActive ? 'text-primary' : 'text-ui-muted-text'}
                        />
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                          <span
                            className={`truncate text-base ${isActive ? 'font-bold text-primary' : 'font-medium text-ui-body'}`}
                          >
                            {item.name}
                          </span>
                          <div className="flex shrink-0 items-center gap-2">
                            {item.tag ? (
                              <span
                                className={`text-[9px] font-bold uppercase tracking-wide ${
                                  item.tag === 'AI'
                                    ? 'min-w-[26px] rounded-full bg-[#7C3AED] px-1.5 py-0.5 text-center text-white'
                                    : 'text-[#9CA3AF]'
                                  }`}
                              >
                                {item.tag}
                              </span>
                            ) : isActive ? (
                              <span
                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_0_3px_rgba(124,58,237,0.2)] dark:shadow-[0_0_0_3px_rgba(167,139,250,0.25)] animate-pulse"
                                aria-hidden
                              />
                            ) : null}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="space-y-4 border-t border-ui-border p-5 pt-6">
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

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-ui-page">
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
              <nav className="flex min-w-0 items-center gap-2 text-base sm:text-base" aria-label="Breadcrumb">
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

          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain bg-ui-page p-5 sm:p-6 md:p-8">
            <div key={pathname} className="motion-page-content animate-page-enter">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
