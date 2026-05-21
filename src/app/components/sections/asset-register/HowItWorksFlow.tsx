"use client";

import React from "react";
import { motion } from "framer-motion";

const HowItWorksFlow = () => {
  const steps = [
    {
      id: "01",
      title: "Entity & KYB",
      description: "Submit your LLC or C corporation details, EIN, directors, and UBOs for verification by our compliance team."
    },
    {
      id: "02",
      title: "Structure SPV",
      description: "Establish a bankruptcy-remote SPV for each asset, with token holder rights mapped to equity."
    },
    {
      id: "03",
      title: "Define Offering",
      description: "Choose Reg D 506(b), 506(c), Reg S, or Reg A+. Set raise size, minimums, and investor restrictions."
    },
    {
      id: "04",
      title: "Tokenize",
      description: "Issue compliant security tokens with on-chain transfer restrictions and whitelisting."
    },
    {
      id: "05",
      title: "Distribute & Manage",
      description: "Onboard investors, automate distributions, manage your cap table, and deliver ongoing reporting."
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
            HOW IT WORKS
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-primary)] font-bold max-w-2xl leading-tight"
          >
            From asset to investor in five guided steps.
          </motion.h2>
        </div>

        <div className="border border-[var(--dashboard-border)] rounded-2xl overflow-hidden shadow-sm">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col md:flex-row items-start md:items-center p-8 md:p-12 border-b border-[var(--dashboard-border)] last:border-0 hover:bg-[var(--card-surface)] transition-all gap-6 md:gap-12"
            >
              <div className="text-3xl md:text-4xl text-[var(--primary)] font-bold w-12">
                {step.id}
              </div>
              <div className="flex-1 max-w-xs">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{step.title}</h3>
              </div>
              <div className="flex-[2] max-w-2xl">
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksFlow;
