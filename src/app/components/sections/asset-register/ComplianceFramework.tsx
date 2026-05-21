"use client";

import React from "react";
import { FileText, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";

const ComplianceFramework = () => {
  const exemptions = [
    {
      icon: <FileText className="w-5 h-5 text-white" />,
      tag: "REG D 506(B) / 506(C)",
      title: "U.S. Accredited Offerings",
      description: "Raise capital from U.S. accredited investors. Rule 506(c) permits general solicitation with verified accreditation."
    },
    {
      icon: <Globe className="w-5 h-5 text-white" />,
      tag: "REG S",
      title: "Offshore Distribution",
      description: "Offer securities to non-U.S. persons outside the United States through substantial offshore transactions."
    },
    {
      icon: <Users className="w-5 h-5 text-white" />,
      tag: "REG A+",
      title: "Public Mini-IPO",
      description: "Raise up to $75M from both accredited and non-accredited U.S. investors with SEC qualification."
    }
  ];

  return (
    <section className="bg-[var(--background)] py-24">
      <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[var(--primary)] text-xs font-bold tracking-widest uppercase mb-4 block"
            >
              COMPLIANCE FRAMEWORK
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-primary)] font-bold leading-tight mb-8"
            >
              Issue under the right exemption — by design.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-[var(--color-text-secondary)] leading-relaxed"
            >
              Every offering on Maxtronize is structured under a recognized U.S.
              securities exemption or offshore framework. We pre-configure investor
              eligibility, transfer restrictions, and disclosure requirements before tokens ever move.
            </motion.p>
          </div>

          {/* Right Content - Exemption List */}
          <div className="lg:w-1/2 border border-[var(--dashboard-border)] rounded-2xl overflow-hidden shadow-sm">
            {exemptions.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 md:p-10 border-b border-[var(--dashboard-border)] last:border-0 hover:bg-[var(--card-surface)] transition-all flex gap-6"
              >
                <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <span className="text-[var(--primary)] text-[10px] font-bold tracking-wider uppercase mb-2 block">
                    {item.tag}
                  </span>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">{item.title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceFramework;
