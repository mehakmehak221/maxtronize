"use client";

import React from "react";
import { XCircle, Fingerprint, FileBadge, Lock, Scale, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const TrustLayer = () => {
  const controls = [
    {
      icon: <XCircle className="w-5 h-5 text-[var(--primary)]" />,
      title: "Qualified Custody",
      description: "Assets and tokens are held with regulated qualified custodians."
    },
    {
      icon: <Fingerprint className="w-5 h-5 text-[var(--primary)]" />,
      title: "KYC / KYB / AML",
      description: "Continuous screening for sanctions exposure, PEP risk, and adverse media."
    },
    {
      icon: <FileBadge className="w-5 h-5 text-[var(--primary)]" />,
      title: "Independent Audits",
      description: "Quarterly proof-of-reserve and SOC 2 Type II controls."
    },
    {
      icon: <Lock className="w-5 h-5 text-[var(--primary)]" />,
      title: "On-chain Transfer Rules",
      description: "Whitelisted wallets only. Restrictions enforced at the protocol layer."
    },
    {
      icon: <Scale className="w-5 h-5 text-[var(--primary)]" />,
      title: "Legal Opinions",
      description: "Each offering includes counsel-reviewed structuring and disclosure documentation."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />,
      title: "Verified Issuers",
      description: "Issuers undergo a rigorous KYB before any offering goes live."
    }
  ];

  return (
    <section className="bg-[var(--dashboard-bg)] py-24">
      <div className="container-main">
        <div className="mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[var(--primary)] text-xs font-bold tracking-widest uppercase mb-4 block"
          >
            TRUST LAYER
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-primary)] font-bold max-w-2xl leading-tight"
          >
            Institutional controls at every step.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-[var(--dashboard-border)] rounded-2xl overflow-hidden">
          {controls.map((control, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-10 border-b border-[var(--dashboard-border)] md:border-r last:border-0 hover:bg-[var(--card-surface)] transition-all group"
            >
              <div className="mb-8 group-hover:scale-110 transition-transform duration-300">
                {control.icon}
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">{control.title}</h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                {control.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustLayer;
