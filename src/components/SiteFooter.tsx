'use client';

import Image from 'next/image';
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
              <a href="#overview" className="te-brand" style={{ display: 'flex', alignItems: 'center' }}>
                <Image src="/light-logo.png" alt="MAXTRON" width={200} height={40} style={{ objectFit: 'contain' }} />
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
