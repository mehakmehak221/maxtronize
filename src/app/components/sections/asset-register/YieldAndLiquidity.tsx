"use client";

import React from "react";
import { TrendingUp, Repeat, Check } from "lucide-react";
import { motion } from "framer-motion";

const YieldAndLiquidity = ({ onStartIssuing }: { onStartIssuing?: () => void }) => {
  return (
    <section className="bg-[var(--background)] py-24">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[var(--card-surface)] border border-[var(--dashboard-border)] rounded-3xl p-10 md:p-16 flex flex-col"
          >
            <div className="mb-10">
              <TrendingUp className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <h2 
              className="text-4xl md:text-5xl text-[var(--color-text-primary)] font-bold mb-6"
            >
              Programmable Yield
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-10 leading-relaxed max-w-sm">
              Distribute rental income, coupon payments, and dividends to token 
              holders on your schedule. Automatic withholding, 1099 generation, and 
              audit trails included.
            </p>
            <ul className="space-y-4 pt-8 border-t border-[var(--dashboard-border)]">
              {[
                "Scheduled or ad-hoc payouts",
                "USD or USDC settlement",
                "Pro-rata distributions with cap table awareness"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-base font-medium text-[var(--color-text-secondary)]">
                  <span className="w-5 h-5 bg-[var(--sidebar-active-bg)] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-[var(--primary)]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Compliant Liquidity Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[var(--card-surface)] border border-[var(--dashboard-border)] rounded-3xl p-10 md:p-16 flex flex-col"
          >
            <div className="mb-10">
              <Repeat className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <h2 
              className="text-4xl md:text-5xl text-[var(--color-text-primary)] font-bold mb-6"
            >
              Compliant Liquidity
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-10 leading-relaxed max-w-sm">
              List on integrated ATS venues for compliant secondary trading. Transfer 
              rules travel with the token, so eligibility is enforced on every trade.
            </p>
            <div className="mt-auto">
              <button 
                onClick={onStartIssuing}
                className="px-6 py-3 bg-[var(--card-surface)] text-[var(--color-text-primary)] border border-[var(--dashboard-border)] rounded-lg text-base font-semibold hover:bg-[var(--field-surface)] transition-all shadow-sm"
              >
                View liquidity partners
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default YieldAndLiquidity;
