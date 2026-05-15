'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { MaxtronizeLogo } from './MaxtronizeLogo';
import { IssuerNavIcon, type IssuerNavIconId } from './IssuerNavIcons';
import { UserProfileMenu } from '@/components/UserProfileMenu';

type NavTag = 'NEW' | 'AI';

type NavItem = {
  name: string;
  href: string;
  icon: IssuerNavIconId;
  tag?: NavTag;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems: { category: string; items: NavItem[] }[] = [
    {
      category: 'PLATFORM',
      items: [
        { name: 'Dashboard', icon: 'dashboard', href: '/issuer/dashboard' },
        { name: 'Issuer Hub', icon: 'hub', tag: 'NEW', href: '/issuer/hub' },
        // { name: 'AI Intelligence', icon: 'ai', tag: 'AI', href: '/issuer/ai-intelligence' },
        { name: 'Portfolio', icon: 'portfolio', href: '/issuer/portfolio' },
        { name: 'Investors', icon: 'investors', href: '/issuer/investors' },
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
    '/issuer/tokenize-asset': 'Tokenize Asset',
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
          className={`motion-sidebar fixed top-0 z-[70] flex h-screen w-64 shrink-0 flex-col border-r border-ui-border bg-ui-sidebar shadow-[2px_0_24px_-12px_rgba(15,23,42,0.06)] dark:shadow-[2px_0_24px_-12px_rgba(0,0,0,0.45)] lg:sticky lg:max-h-screen lg:translate-x-0 ${
            isMobileMenuOpen ? 'is-open translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="relative flex h-17 shrink-0 items-center justify-center border-b border-ui-border bg-ui-sidebar px-4">
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
              href="/issuer/tokenize-asset"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-press flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-brand-indigo py-3.5 text-[13px] font-bold text-white shadow-[0_12px_32px_-10px_rgba(91,33,182,0.55)] transition-all hover:brightness-[1.05] dark:shadow-[0_12px_32px_-12px_rgba(124,58,237,0.45)]"
            >
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 4v16m8-8H4" />
              </svg>
              <span>Tokenize Asset</span>
            </Link>
          </div>

          <nav className="motion-sidebar-nav scrollbar-hide flex-1 space-y-8 overflow-y-auto px-4 pb-4 pt-2">
            {menuItems.map((category, idx) => (
              <div key={idx} className="space-y-1">
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ui-faint">{category.category}</p>
                  {idx === 0 ? (
                    <Link
                      href="/investor/overview"
                      className="rounded-md border border-primary/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/5"
                    >
                      Switch
                    </Link>
                  ) : null}
                </div>
                <div className="space-y-1">
                  {category.items.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`motion-nav-link relative flex w-full items-center gap-3 rounded-2xl py-3 pl-4 pr-3 ${
                          isActive
                            ? 'border-l-[4px] border-primary bg-ui-accent-tint text-primary shadow-[inset_0_0_0_1px_rgba(124,58,237,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(167,139,250,0.12)]'
                            : 'border-l-[4px] border-transparent text-ui-muted-text hover:bg-ui-muted-deep hover:text-ui-strong'
                        }`}
                      >
                        <IssuerNavIcon
                          id={item.icon}
                          className={isActive ? 'text-primary' : 'text-ui-muted-text'}
                        />
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                          <span
                            className={`truncate text-[13px] ${isActive ? 'font-bold text-primary' : 'font-medium text-ui-body'}`}
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
                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_0_3px_rgba(124,58,237,0.2)] dark:shadow-[0_0_0_3px_rgba(167,139,250,0.25)]"
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
            <div className="hidden rounded-xl border border-ui-success-border/70 bg-ui-success-bg-soft p-4 lg:block">
              <div className="mb-1.5 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-ui-success-icon shadow-[0_0_8px_rgba(16,185,129,0.45)]" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-ui-success-text">All systems operational</p>
              </div>
              <p className="text-[9px] font-medium leading-relaxed text-ui-success-text/90">99.98% uptime · Blockchain synced</p>
            </div>
            <div className="flex flex-col gap-3 lg:hidden">
              <button
                type="button"
                className="relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-ui-muted-text transition-colors hover:bg-ui-muted-deep hover:text-ui-strong"
                aria-label="Notifications"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="text-[13px] font-semibold text-ui-body">Notifications</span>
                <span className="ml-auto h-2 w-2 rounded-full bg-[#7c3aed]" aria-hidden />
              </button>
              <div className="flex items-center justify-between gap-3 px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ui-faint">Appearance</span>
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
          <header className="motion-header z-40 flex h-17 shrink-0 items-center justify-between gap-4 border-b border-ui-border bg-ui-sidebar px-4 sm:px-6 md:px-8">
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
              <nav className="flex min-w-0 items-center gap-2 text-[13px] sm:text-sm" aria-label="Breadcrumb">
                <span className="shrink-0 font-medium text-ui-placeholder">Platform</span>
                <span className="shrink-0 font-medium text-ui-faint" aria-hidden>
                  &gt;
                </span>
                <span className="min-w-0 truncate font-semibold text-ui-strong">{currentPage}</span>
              </nav>
            </div>

            <div className="hidden shrink-0 items-center gap-1 sm:gap-2 md:gap-3 lg:flex">
              <button
                type="button"
                className="relative rounded-lg p-2 text-ui-muted-text transition-colors hover:bg-ui-muted-deep hover:text-ui-strong"
                aria-label="Notifications"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span
                  className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-ui-sidebar bg-[#7c3aed] dark:border-[#0d0d12]"
                  aria-hidden
                />
              </button>
              <button
                type="button"
                className="hidden rounded-lg p-2 text-ui-muted-text transition-colors hover:bg-ui-muted-deep hover:text-ui-strong sm:block"
                aria-label="Settings"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <div className="mx-1 hidden h-8 w-px shrink-0 bg-ui-border sm:block" aria-hidden />
              <UserProfileMenu variant="header" />
              <div className="flex items-center pl-1 [&_button]:p-1.5">
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
