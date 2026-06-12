'use client';

import { Ban } from 'lucide-react';
import Reveal from '../Reveal';
import TkSection from './TkSection';
import { complianceContent, legalExclusions } from '@/lib/tokenomics-data';

export default function ComplianceSection() {
  return (
    <TkSection
      id="compliance"
      label={complianceContent.title}
      subtitle={`${complianceContent.body} ${complianceContent.exclusionsIntro}`}
      center
      alt
    >
      <Reveal variant="up">
        <div className="te-excl-grid">
          {legalExclusions.map((item, i) => (
            <div 
              key={item} 
              className="te-glass te-excl w3-excl-card" 
              style={{ 
                animationDelay: `${i * 100}ms`,
                transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(220,38,38,0.2)';
                e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <Ban className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5 text-[#ef4444]" />
              {item}
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal variant="up" delay={200}>
        <p className="te-body" style={{ marginTop: '1.5rem', textAlign: 'center' }}>{complianceContent.footer}</p>
      </Reveal>
    </TkSection>
  );
}
