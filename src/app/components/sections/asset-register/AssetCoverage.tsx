"use client";

import React from "react";
import { Building2, CreditCard, Server, Coins } from "lucide-react";
import { motion } from "framer-motion";

const AssetCoverage = () => {
  const assets = [
    {
      icon: <Building2 className="w-5 h-5 text-[var(--primary)]" />,
      title: "Real Estate",
      description: "Commercial, multifamily, and industrial properties with rental yield distribution.",
      footer: "SPV-PER-ASSET · TITLE CUSTODY"
    },
    {
      icon: <CreditCard className="w-5 h-5 text-[var(--primary)]" />,
      title: "Private Credit",
      description: "Secured lending, trade finance, and structured notes with scheduled coupon payouts.",
      footer: "BORROWER KYB · LOAN TAPE"
    },
    {
      icon: <Server className="w-5 h-5 text-[var(--primary)]" />,
      title: "Data Centers",
      description: "Operating infrastructure with long-duration colocation revenue and contracted uptime.",
      footer: "MW CAPACITY · TENANT CONTRACTS"
    },
    {
      icon: <Coins className="w-5 h-5 text-[var(--primary)]" />,
      title: "Commodities",
      description: "Allocated gold and physical commodities backed by audited custodial reserves.",
      footer: "PROOF-OF-RESERVE · VAULTED"
    }
  ];

  return (
    <section className="bg-[var(--background)] py-20">
      <div className="container-main">
        <div className="mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[var(--primary)] text-xs font-bold tracking-widest uppercase mb-4 block"
          >
            ASSET COVERAGE
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-primary)] font-bold max-w-2xl leading-tight"
          >
            Built for the assets institutions actually hold.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[var(--dashboard-border)] rounded-2xl overflow-hidden shadow-sm">
          {assets.map((asset, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 border-b md:border-b-0 md:border-r border-[var(--dashboard-border)] last:border-0 hover:bg-[var(--card-surface)] transition-all"
            >
              <div className="w-10 h-10 bg-[var(--sidebar-active-bg)] rounded-lg flex items-center justify-center mb-10">
                {asset.icon}
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{asset.title}</h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-10 min-h-[60px]">
                {asset.description}
              </p>
              <div className="pt-6 border-t border-[var(--dashboard-border)]">
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] tracking-wider uppercase">
                  {asset.footer}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AssetCoverage;
