"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/app/components/sections/Navbar";
import Footer from "@/app/components/sections/Footer";
import { AlertCircle } from "lucide-react";

import RoadmapHero from "./components/RoadmapHero";
import EpicsTab from "./components/EpicsTab";
import { StrategyTab, RequirementsTab, FutureTab } from "./components/OtherTabs";

export default function RoadmapPage() {
  const [btnHovered, setBtnHovered] = useState(false);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 140; // sticky nav height buffer
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const handlePillarClick = useCallback((epicId: number) => {
    scrollTo(`epic-${epicId}`);
  }, [scrollTo]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans relative overflow-x-hidden selection:bg-[#6653AF]/20 selection:text-[#513C9E]">
      <Navbar />

      {/* Floating Animated Liquid Glass Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 80, -40, 0], y: [0, -90, 40, 0], scale: [1, 1.15, 0.9, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 left-10 w-96 h-96 rounded-full bg-purple-200/25 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -60, 50, 0], y: [0, 80, -60, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-10 w-[450px] h-[450px] rounded-full bg-cyan-200/15 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 40, -50, 0], y: [0, -40, 60, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/4 w-[350px] h-[350px] rounded-full bg-pink-100/25 blur-3xl"
        />
      </div>

      {/* Hero */}
      <RoadmapHero onPillarClick={handlePillarClick} />

      {/* Navigation handled by hero chakra pillar clicks */}

      {/* ALL Content Sections - Continuous Scroll */}
      <main className="flex-grow w-full z-10">
        {/* Section 1: Implementation Epics */}
        <section id="epics" className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-10 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase font-bold text-[#6653AF] tracking-widest">12-Week Execution Plan</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-2">Implementation Roadmap</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-2xl mx-auto">All 10 epics displayed in execution order. Scroll down to explore each milestone.</p>
            </div>
          </motion.div>
          <EpicsTab />
        </section>

        {/* Divider */}
        <div className="w-full border-t border-slate-200/60" />

        {/* Section 2: Delivery Strategy */}
        <section id="strategy" className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-10 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <StrategyTab />
          </motion.div>
        </section>

        {/* Divider */}
        <div className="w-full border-t border-slate-200/60" />

        {/* Section 3: Go-Live Requirements */}
        <section id="requirements" className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-10 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <RequirementsTab />
          </motion.div>
        </section>

        {/* Divider */}
        <div className="w-full border-t border-slate-200/60" />

        {/* Section 4: Phase 3 & Beyond */}
        <section id="future" className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-10 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <FutureTab />
          </motion.div>
        </section>
      </main>

      {/* Bottom Banner */}
      <section className="bg-white border-t border-slate-200/80 py-4 sm:py-5 z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#6653AF] shrink-0" />
            <p className="text-xs text-slate-600 font-medium">
              <strong>Execution Scope Notice:</strong> Tracks run in parallel. Implementation times average 12–16 weeks leading to final Go-Live checkpoints.
            </p>
          </div>
          <motion.a
            href="https://maxtronize.gitbook.io/maxtronize-whitepaper"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-md bg-[#1A1A1A] pl-5 pr-4 py-2.5 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 shrink-0"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
              initial={{ x: "-100%" }}
              animate={{ x: btnHovered ? "0%" : "-100%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Read Whitepaper</span>
            <span className="relative z-10 flex items-center justify-center transition-transform group-hover:translate-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 5C16 5.742 16.733 6.85 17.475 7.78C18.429 8.98 19.569 10.027 20.876 10.826C21.856 11.425 23.044 12 24 12M24 12C23.044 12 21.855 12.575 20.876 13.174C19.569 13.974 18.429 15.021 17.475 16.219C16.733 17.15 16 18.26 16 19M24 12H0" stroke="white" strokeWidth="2" />
              </svg>
            </span>
          </motion.a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
