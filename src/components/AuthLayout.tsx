"use client";

import React, { useLayoutEffect } from "react";
import Image from "next/image";
import { ForceLightTheme } from "@/components/ForceLightTheme";
import { MaxtronizeLogo } from "@/components/MaxtronizeLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
  isSignUp: boolean;
  onToggle: (val: boolean) => void;
  hideToggle?: boolean;
}

export default function AuthLayout({
  children,
  isSignUp,
  onToggle,
  hideToggle = false,
}: AuthLayoutProps) {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const mount = document.querySelector<HTMLElement>(".motion-app-mount");

    html.classList.add("auth-page-active");
    body.classList.add("auth-page-active");
    mount?.classList.add("auth-page-active");

    return () => {
      html.classList.remove("auth-page-active");
      body.classList.remove("auth-page-active");
      mount?.classList.remove("auth-page-active");
    };
  }, []);

  return (
    <ForceLightTheme>
      <div className="auth-layout-root flex min-h-dvh w-full flex-col overflow-x-hidden bg-white font-sans md:h-dvh md:max-h-dvh md:flex-row md:overflow-hidden">
      <div className="auth-hero-panel relative hidden min-h-0 overflow-x-hidden overflow-y-auto overscroll-y-contain bg-primary-deep md:flex md:w-[50%] lg:w-[52%] xl:w-[58%] 2xl:w-[60%] [-webkit-overflow-scrolling:touch]">
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

        <div className="relative z-10 flex flex-col gap-6 p-6 md:gap-7 md:p-7 lg:gap-8 lg:p-10 xl:p-12 2xl:p-14">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-36 md:h-10 md:w-44">
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
            <h1 className="mb-3 text-balance text-2xl font-bold leading-[1.12] tracking-tight text-white md:text-3xl lg:text-4xl xl:text-5xl">
              Tokenize{" "}
              <span className="bg-linear-to-r from-[#A684FF] via-[#DAB2FF] to-[#7C86FF] bg-clip-text text-transparent">
                Real Assets
              </span>
              . Raise Capital Globally.
            </h1>
            <p className="mb-5 max-w-lg text-sm leading-relaxed text-white md:mb-6 md:text-[15px] lg:mb-7">
              The institutional platform for compliant real-world asset
              tokenization. SEC Reg D to MiCA — all in one secure workspace.
            </p>

            <div className="mb-5 flex flex-wrap gap-2 md:mb-6 lg:mb-8">
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

            <div className="space-y-3 md:space-y-4">
              {[
                {
                  icon: (
                    <svg
                      className="h-4 w-4 text-white/80 md:h-5 md:w-5"
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
                      className="h-4 w-4 text-white/80 md:h-5 md:w-5"
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
                      className="h-4 w-4 text-white/80 md:h-5 md:w-5"
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
                <div key={i} className="group flex items-start gap-3 md:gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-colors group-hover:bg-white/10 md:h-9 md:w-9">
                    {item.icon}
                  </div>
                  <p className="text-[11px] leading-snug text-white/80 md:text-[13px]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white md:mb-4">
              Trusted by leading institutions
            </h3>
            <div className="flex flex-wrap items-center gap-2 md:gap-x-3 md:gap-y-2 lg:gap-x-6 lg:gap-y-3">
              {[
                "BlackRock RE",
                "Gulf Sovereign",
                "Meridian Capital",
                "Pacific Rim Holdings",
              ].map((inst) => (
                <span
                  key={inst}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm md:px-3 md:py-1.5 md:text-[11px]"
                >
                  {inst}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5 md:gap-4 md:pt-6 lg:gap-8">
            {[
              { label: "Assets Tokenized", value: "$2.4B+" },
              { label: "Active Issuers", value: "340+" },
              { label: "Accredited Investors", value: "12,800+" },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0">
                <p className="mb-0.5 text-lg font-bold text-white md:text-xl lg:text-2xl">
                  {stat.value}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wide text-white/40 md:text-[10px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-panel relative flex w-full min-w-0 shrink-0 flex-col p-3 pb-16 sm:p-4 sm:pb-20 md:flex md:min-h-0 md:flex-1 md:flex-col md:overflow-y-auto md:p-6 md:pb-8 lg:p-8 lg:pb-10 xl:p-10">
        <div className="auth-form-panel-inner auth-form-viewport-scale motion-auth-form mx-auto w-full min-w-0 space-y-5 py-2 md:space-y-6 lg:space-y-7">
          
          <div className="md:hidden text-center space-y-2 pb-3 border-b border-[#E5E7EB]">
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

          {!hideToggle && (
            <div className="flex rounded-full border border-[#E5E7EB] bg-[#F3F4F6] p-1 shadow-inner">
              <button
                onClick={() => onToggle(false)}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-all md:px-6 md:py-3 md:text-[15px] ${!isSignUp ? "bg-white text-[#111827] shadow-sm shadow-black/5" : "text-[#9CA3AF] hover:text-[#4B5563]"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => onToggle(true)}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-all md:px-6 md:py-3 md:text-[15px] ${isSignUp ? "bg-white text-[#111827] shadow-sm shadow-black/5" : "text-[#9CA3AF] hover:text-[#4B5563]"}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {children}

          
          <div className="pt-5 space-y-5">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-6 lg:gap-8">
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
