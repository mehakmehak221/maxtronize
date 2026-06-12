'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { Menu, Shield, X } from 'lucide-react';

const links = [
  { label: 'Framework', href: '#framework' },
  { label: 'Firewall', href: '#firewall' },
  { label: 'Functions', href: '#functions' },
  { label: 'Utility', href: '#utility' },
  { label: 'Supply', href: '#supply' },
  { label: 'Compliance', href: '#compliance' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState('#overview');

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const targets = [
      { id: 'overview' },
      ...links.map((l) => ({ id: l.href.slice(1) })),
      { id: 'governance' },
      { id: 'value' },
    ];
    const els = targets.map((t) => document.getElementById(t.id)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(`#${e.target.id}`); }),
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  return (
    <header className={`te-nav-wrap${solid ? ' te-nav-solid' : ''}${open ? ' te-nav-open' : ''}`}>
      <div className="page-container">
        <div className="te-nav-inner">
          <a href="#overview" onClick={(e) => go(e, '#overview')} className="te-brand">
            <div className="te-logo"><Shield className="h-4 w-4 text-white" /></div>
            <span className="te-brand-name">MAXTRON</span>
          </a>

          <nav className="te-nav-pill" aria-label="Sections">
            <div className="te-nav-pill-inner">
              {links.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => go(e, item.href)}
                  className={`te-nav-link${active === item.href ? ' te-nav-link-on' : ''}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <a href="#supply" onClick={(e) => go(e, '#supply')} className="te-btn te-btn-primary te-nav-cta">
            Supply
          </a>

          <button type="button" className="te-menu-btn" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="te-mobile-nav">
            <a href="#overview" onClick={(e) => go(e, '#overview')} className={active === '#overview' ? 'te-nav-link-on' : ''}>Overview</a>
            {links.map((item) => (
              <a key={item.href} href={item.href} onClick={(e) => go(e, item.href)} className={active === item.href ? 'te-nav-link-on' : ''}>
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
