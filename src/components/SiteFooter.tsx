'use client';

import { Shield } from 'lucide-react';
import { closingContent, heroContent } from '@/lib/tokenomics-data';

const cols = [
  { title: 'Platform', links: ['Framework', 'Firewall', 'Functions'] },
  { title: 'Tokenomics', links: ['Utility', 'Supply', 'Value'] },
  { title: 'Legal', links: ['Governance', 'Compliance'] },
];

const hrefs: Record<string, string> = {
  Framework: '#framework',
  Firewall: '#firewall',
  Functions: '#functions',
  Utility: '#utility',
  Supply: '#supply',
  Value: '#value',
  Governance: '#governance',
  Compliance: '#compliance',
};

export default function SiteFooter() {
  return (
    <footer className="te-footer">
      <div className="page-container">
        <div className="te-footer-card te-glass">
          <div className="te-footer-main">
            <div className="te-footer-brand">
              <a href="#overview" className="te-brand">
                <div className="te-logo"><Shield className="h-4 w-4 text-white" /></div>
                <span className="te-brand-name">MAXTRON</span>
              </a>
              <p className="te-footer-desc">{heroContent.lead}</p>
            </div>

            <nav className="te-footer-links" aria-label="Footer">
              {cols.map((col) => (
                <div key={col.title} className="te-footer-group">
                  <h4>{col.title}</h4>
                  {col.links.map((l) => (
                    <a key={l} href={hrefs[l]}>{l}</a>
                  ))}
                </div>
              ))}
            </nav>
          </div>

          <div className="te-footer-bottom">
            <p>{closingContent.signoff}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
