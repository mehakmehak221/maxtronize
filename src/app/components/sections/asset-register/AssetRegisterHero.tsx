"use client";

import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const AssetRegisterHero = ({ onStartIssuing }: { onStartIssuing?: () => void }) => {
  const stats = [
    { label: "Asset Capacity", value: "$2.4B+" },
    { label: "SPV Jurisdictions", value: "12+" },
    { label: "KYB Pass Rate", value: "94%" },
    { label: "Settlement", value: "T+0" },
  ];

  return (
    <section className="bg-[var(--background)] pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container-main">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--dashboard-border)] bg-[var(--card-surface)] mb-8"
        >
          <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-base md:text-base font-medium text-[var(--color-text-secondary)]">
            SEC-aligned · Reg D · Reg S · Reg A+
          </span>
        </motion.div>

        {/* Hero Content */}
        <div className="max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--color-text-primary)] leading-[1.1] mb-8"
          >
            Tokenize Real Assets.<br />
            <span className="text-[var(--color-text-muted)]">Raise Capital Globally.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl leading-relaxed"
          >
            Maxtronize is an institutional-grade platform that helps asset owners
            structure, tokenize, and distribute real-world assets globally, with
            compliance, custody, and investor management built in.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-20"
          >
            <button 
              onClick={onStartIssuing}
              className="px-8 py-3.5 bg-[var(--primary)] text-white rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-all group shadow-lg shadow-purple-500/20"
            >
            Start Tokenizing My Asset
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onStartIssuing}
              className="px-8 py-3.5 bg-[var(--card-surface)] text-[var(--color-text-primary)] border border-[var(--dashboard-border)] rounded-lg font-semibold hover:bg-[var(--field-surface)] transition-all"
            >
              Talk to Compliance
            </button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-12 border-t border-[var(--dashboard-border)]"
        >
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">{stat.value}</span>
              <span className="text-xs md:text-sm font-bold text-[var(--color-text-muted)] tracking-wider uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AssetRegisterHero;
