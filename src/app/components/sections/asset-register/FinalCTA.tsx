"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const FinalCTA = ({ onStartIssuing }: { onStartIssuing?: () => void }) => {
  return (
    <section className="bg-[var(--background)] py-24">
      <div className="container-main">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[var(--card-surface)] border border-[var(--dashboard-border)] rounded-[2.5rem] p-12 md:p-24 text-center shadow-sm"
        >
          <div className="max-w-3xl mx-auto">
            <h2 
              className="text-5xl md:text-7xl font-bold text-[var(--color-text-primary)] leading-tight mb-8"
            >
              Bring your asset onto Maxtronize.
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Talk to our compliance team about your offering structure. Most issuers go 
              from intake to live offering in under 60 days.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={onStartIssuing}
                className="px-10 py-4 bg-[var(--primary)] text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all group shadow-xl shadow-purple-500/20"
              >
               Start Tokenizing My Asset
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onStartIssuing}
                className="px-10 py-4 bg-[var(--card-surface)] text-[var(--color-text-primary)] border border-[var(--dashboard-border)] rounded-xl font-bold hover:bg-[var(--field-surface)] transition-all"
              >
                Book a call
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
