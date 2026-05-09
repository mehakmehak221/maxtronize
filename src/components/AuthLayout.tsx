"use client";

import React from "react";
import Image from "next/image";
import { ForceLightTheme } from "@/components/ForceLightTheme";
import { MaxtronizeLogo } from "@/components/MaxtronizeLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
  isSignUp: boolean;
  onToggle: (val: boolean) => void;
}

export default function AuthLayout({
  children,
  isSignUp,
  onToggle,
}: AuthLayoutProps) {
  return (
    <ForceLightTheme>
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex lg:w-[60%] bg-primary-deep relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 bg-mesh auth-hero-mesh"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 100px, rgba(255,255,255,0.05) 100px, rgba(255,255,255,0.05) 200px)`,
            }}
          ></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="relative h-10 w-44">
              <Image
                src="/lightlogo.png"
                alt="Maxtronize"
                fill
                className="object-contain object-left"
                sizes="176px"
                priority
              />
            </div>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-5xl xl:text-6xl font-bold text-white leading-[1.12] tracking-tight mb-6">
              Tokenize Real Assets. Raise Capital Globally.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg">
              The institutional platform for compliant real-world asset
              tokenization. SEC Reg D to MiCA — all in one secure workspace.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {[
                "Real Estate",
                "Private Credit",
                "Data Centers",
                "Commodities",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-white/90 text-sm font-medium bg-white/[0.08] border border-white/15 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-5">
              {[
                {
                  icon: (
                    <svg
                      className="w-5 h-5 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ),
                  text: "SEC Reg D / Reg S / Reg A+ · MiCA · FINMA · MAS compliance built-in",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  text: "Global capital access across 190+ countries and 40+ jurisdictions",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ),
                  text: "Automated smart contract distributions & on-chain investor registry",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center bg-white/5 transition-colors group-hover:bg-white/10">
                    {item.icon}
                  </div>
                  <p className="text-white/80 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="mb-10">
            <h3 className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-5">
              Trusted by leading institutions
            </h3>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {[
                "BlackRock RE",
                "Gulf Sovereign",
                "Meridian Capital",
                "Pacific Rim Holdings",
              ].map((inst) => (
                <span
                  key={inst}
                  className="text-white/45 text-xs font-semibold px-4 py-2 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-sm"
                >
                  {inst}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-12 pt-10 border-t border-white/10">
            {[
              { label: "Assets Tokenized", value: "$2.4B+" },
              { label: "Active Issuers", value: "340+" },
              { label: "Accredited Investors", value: "12,800+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-white text-3xl font-bold mb-1">
                  {stat.value}
                </p>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Scrollable Auth Section */}
      <div className="flex-1 bg-background p-6 md:p-12 lg:p-24 flex flex-col justify-center overflow-y-auto relative">
        <div className="max-w-md w-full mx-auto space-y-8 md:space-y-10">
          {/* Mobile branding — only visible when hero panel is hidden */}
          <div className="lg:hidden text-center space-y-2 pb-4 border-b border-border">
            <div className="relative h-7 w-28 mx-auto">
              <MaxtronizeLogo
                fill
                sizes="112px"
                className="object-contain"
                alt="Maxtronize Logo"
              />
            </div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Asset Protocol
            </p>
          </div>

          <div className="bg-[#eceef2] p-1 rounded-2xl flex shadow-inner border border-border/80">
            <button
              onClick={() => onToggle(false)}
              className={`flex-1 py-3 px-6 rounded-xl text-[15px] font-bold transition-all ${!isSignUp ? "bg-card text-foreground shadow-md shadow-black/5" : "text-text-muted hover:text-foreground"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => onToggle(true)}
              className={`flex-1 py-3 px-6 rounded-xl text-[15px] font-bold transition-all ${isSignUp ? "bg-card text-foreground shadow-md shadow-black/5" : "text-text-muted hover:text-foreground"}`}
            >
              Sign Up
            </button>
          </div>

          {children}

          {/* Footer Icons & Legal (Shared) */}
          <div className="pt-10 space-y-8">
            <div className="flex justify-center items-center gap-8">
              {[
                {
                  label: "SOC 2 Type II",
                  icon: (
                    <svg
                      className="w-3.5 h-3.5 text-text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  ),
                },
                {
                  label: "ISO 27001",
                  icon: (
                    <svg
                      className="w-3.5 h-3.5 text-text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  ),
                },
                {
                  label: "SEC Regulated",
                  icon: (
                    <svg
                      className="w-3.5 h-3.5 text-text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-center text-text-muted opacity-60 font-medium">
              © 2049 Maxtronize, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
    </ForceLightTheme>
  );
}
