'use client';

import { Vote, Shield, Scale, ChevronRight } from 'lucide-react';
import Reveal from './Reveal';
import SectionShell from './SectionShell';
import SectionTitle from './SectionTitle';

const governancePoints = [
  'Verification standards',
  'Compliance requirements',
  'Listing criteria',
  'Bond requirements',
  'Platform fee structures',
  'Ecosystem growth initiatives',
];

export default function GovernancePanel() {
  return (
    <SectionShell id="governance" theme="light">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <SectionTitle
          align="left"
          number="08"
          kicker="Governed by"
          title={<>MAXTRON<br />Governance</>}
          subtitle="Operational layer · Not property economics"
        />

        <div className="space-y-5">
          <Reveal delay={80} variant="right">
            <div className="ui-card ui-card-lift ui-stat">
              <div className="flex items-start gap-4">
                <div className="ui-principle-icon !bg-[#391F6B]/10 !border-[#391F6B]/15 !text-[#391F6B]">
                  <Vote className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[#391F6B]">Transparent</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6b5b8a]">
                    MAXTRON enables governance participation across the platform. Governance is focused on operational and ecosystem parameters — not property-level rental distributions.
                  </p>
                  <a href="#utility" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#391F6B] hover:underline">
                    Governance Module <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140} variant="right">
            <div className="ui-card ui-card-lift ui-stat">
              <div className="flex items-start gap-4">
                <div className="ui-principle-icon !bg-[#391F6B]/10 !border-[#391F6B]/15 !text-[#391F6B]">
                  <Scale className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[#391F6B]">Lock-Weighted Voting</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6b5b8a]">
                    Voting influence may be determined through lock-weighted governance mechanisms that encourage long-term participation rather than passive accumulation.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={180} className="mt-12">
        <div className="ui-bento ui-bento-3">
          {governancePoints.map((pt, i) => (
            <Reveal key={pt} delay={i * 40} variant="scale" className="h-full">
              <div className="ui-card ui-stat flex h-full items-center gap-3">
                <Vote className="h-4 w-4 shrink-0 text-[#391F6B]" />
                <span className="text-sm font-semibold text-[#374151]">{pt}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal delay={220} className="mt-8">
        <div className="ui-bento ui-bento-3">
          {[
            { icon: Shield, label: 'EVM Compatible Network' },
            { icon: Scale, label: 'Utility & Compliance Token' },
            { icon: Vote, label: 'On-Chain Governance Ready' },
          ].map((item) => (
            <div key={item.label} className="ui-chip justify-center py-3">
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}
