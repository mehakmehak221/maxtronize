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
      <div className="h-screen flex font-sans overflow-hidden">
      <div className="hidden lg:flex lg:w-[60%] bg-primary-deep relative overflow-hidden flex-col justify-between p-10 xl:p-14">
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

        <div className="motion-auth-hero relative z-10">
          <div className="flex items-center gap-3 mb-10">
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
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.12] tracking-tight mb-4">
              Tokenize{" "}
              <span className="bg-linear-to-r from-[#A684FF] via-[#DAB2FF] to-[#7C86FF] bg-clip-text text-transparent">
                Real Assets
              </span>
              . Raise Capital Globally.
            </h1>
            <p className="text-white text-[15px] leading-relaxed mb-7 max-w-lg">
              The institutional platform for compliant real-world asset
              tokenization. SEC Reg D to MiCA — all in one secure workspace.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-8">
              {[
                "Real Estate",
                "Private Credit",
                "Data Centers",
                "Commodities",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full text-white/90 text-xs font-medium bg-white/[0.08] border border-white/15 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-4">
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
                  <p className="text-white/80 text-[13px] leading-snug">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="motion-auth-hero relative z-10">
          <div className="mb-7">
            <h3 className="text-white text-[10px] font-bold tracking-[0.2em] uppercase mb-5">
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
                  className="text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-sm"
                >
                  {inst}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/10">
            {[
              { label: "Assets Tokenized", value: "$2.4B+" },
              { label: "Active Issuers", value: "340+" },
              { label: "Accredited Investors", value: "12,800+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-white text-2xl font-bold mb-1">
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

      
      <div className="flex-1 min-h-0 bg-white text-[#1F2937] p-3 sm:p-4 md:p-6 lg:p-10 flex flex-col justify-start relative">
        <div
          className="motion-auth-form max-w-md w-full mx-auto space-y-5 md:space-y-7 transform-gpu"
          style={{
            transformOrigin: "top center",
            transform:
              "scale(clamp(0.78, calc((100vh - 2rem) / 860px), 1))",
          }}
        >
          
          <div className="lg:hidden text-center space-y-2 pb-3 border-b border-[#E5E7EB]">
            <div className="relative h-7 w-28 mx-auto">
              <MaxtronizeLogo
                fill
                sizes="112px"
                className="object-contain"
                alt="Maxtronize Logo"
              />
            </div>
            <p className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest">
              Asset Protocol
            </p>
          </div>

          <div className="flex rounded-full border border-[#E5E7EB] bg-[#F3F4F6] p-1 shadow-inner">
            <button
              onClick={() => onToggle(false)}
              className={`flex-1 rounded-full py-3 px-6 text-[15px] font-bold transition-all ${!isSignUp ? "bg-white text-[#111827] shadow-sm shadow-black/5" : "text-[#9CA3AF] hover:text-[#4B5563]"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => onToggle(true)}
              className={`flex-1 rounded-full py-3 px-6 text-[15px] font-bold transition-all ${isSignUp ? "bg-white text-[#111827] shadow-sm shadow-black/5" : "text-[#9CA3AF] hover:text-[#4B5563]"}`}
            >
              Sign Up
            </button>
          </div>

          {children}

          
          <div className="pt-5 space-y-5">
            <div className="flex justify-center items-center gap-8">
              {[
                {
                  label: "SOC 2 Type II",
                  icon: (
                    <svg
                      className="w-3.5 h-3.5 text-[#9CA3AF]"
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
                      className="w-3.5 h-3.5 text-[#9CA3AF]"
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
                      className="w-3.5 h-3.5 text-[#9CA3AF]"
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
                  <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-center text-[#9CA3AF] font-medium">
              © 2049 Maxtronize, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      </div>
    </ForceLightTheme>
  );
}
