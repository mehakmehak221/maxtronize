"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: custom,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      delay: custom,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      delay: custom,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

type CTAButtonProps = {
  href: string;
  label: string;
};

function CTAButton({ href, label }: CTAButtonProps) {
  return (
    <Link
      href={href}
      className="group relative flex w-fit items-center gap-3 overflow-hidden rounded-md bg-[#1A1A1A] px-5 py-2.5 text-base font-medium text-white shadow-md transition-all hover:shadow-lg"
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <span className="relative z-10">{label}</span>

      <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 12H19M19 12L13 6M19 12L13 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

type FeatureProps = {
  title: string;
  description: string;
};

function Feature({ title, description }: FeatureProps) {
  return (
    <li className="flex gap-3">
      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#6653AF]" />

      <p className="text-base leading-relaxed text-[#333333]">
        <span className="font-semibold text-[#111111]">{title}: </span>
        {description}
      </p>
    </li>
  );
}

type VideoPanelProps = {
  src: string;
};

function VideoPanel({ src }: VideoPanelProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#ECE8FF] bg-[#F8F5FF] shadow-[0_4px_32px_rgba(102,83,175,0.10)]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C4B5FD]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#A78BFA]/15 blur-3xl" />

      <video
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="auto"
        className="relative z-10 w-full object-contain"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

export default function Intelligence() {
  return (
    <section
      id="intelligence"
      className="relative w-full overflow-hidden bg-white py-20 md:py-28"
    >
      <div className="relative mx-auto max-w-[96rem] px-6 md:px-10 lg:px-16 xl:px-20">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            className="text-[24px] font-semibold leading-tight tracking-tight text-[#111111] sm:text-[32px] md:text-[44px]"
          >
            Maxtronize Asset Intelligence:{" "}
            <span className="text-[#6653AF]">The AI Engine</span>
          </motion.h2>

          <motion.p
            custom={0.15}
            variants={fadeUp}
            className="mt-5 max-w-2xl text-sm leading-relaxed text-[#2e2b2b] sm:text-[15px]"
          >
            A dual-purpose engine designed to reduce uncertainty for investors
            and streamline execution for brokers. By synthesizing millions of
            data points, it turns market volatility into a clearer roadmap for
            disciplined wealth creation.
          </motion.p>
        </motion.div>

        {/* Section 1 */}
        <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.h3
              custom={0}
              variants={fadeLeft}
              className="mb-6 text-[20px] font-semibold text-[#111111] sm:text-[24px] md:text-[28px]"
            >
              For Investors:{" "}
              <span className="text-[#6653AF]">Precision Over Intuition</span>
            </motion.h3>

            <motion.ul
              custom={0.1}
              variants={fadeLeft}
              className="mb-8 space-y-4"
            >
              <Feature
                title="Dynamic ROI Calibration"
                description="Real-time yield modeling based on current market shifts, taxes, and maintenance costs."
              />

              <Feature
                title="Predictive Appreciation"
                description="AI-driven forecasting that projects property value 5, 10, and 15 years out using historical patterns and urban development data."
              />

              <Feature
                title="Side-by-Side Comparative Analysis"
                description="Instantly compare multiple assets to find the best fit for your portfolio."
              />
            </motion.ul>

            <motion.div custom={0.2} variants={fadeLeft}>
              <CTAButton
                href="https://beta.maxtronize.com/signin"
                label="Join as an Investor"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0.15}
            variants={fadeRight}
          >
            <VideoPanel src="/images/assets1.mp4" />
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mb-20 h-px w-full bg-gradient-to-r from-transparent via-[#D8D0F5] to-transparent" />

        {/* Section 2 */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0.1}
            variants={fadeLeft}
            className="order-2 lg:order-1"
          >
            <VideoPanel src="/images/assets2.mp4" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="order-1 lg:order-2"
          >
            <motion.h3
              custom={0}
              variants={fadeRight}
              className="mb-6 text-[22px] font-semibold text-[#111111] sm:text-[26px] md:text-[28px]"
            >
              For Asset Issuers:{" "}
              <span className="block text-[#6653AF]">
                The Ultimate Sales Force
              </span>
            </motion.h3>
            <motion.ul
              custom={0.1}
              variants={fadeRight}
              className="mb-8 space-y-4"
            >
              <Feature
                title="AI Sales Tactics"
                description="AI outreach assistants handle qualification and objections using data-backed responses."
              />

              <Feature
                title="Lead Scoring"
                description="Focus on high-value prospects while AI nurtures the rest 24/7."
              />

              <Feature
                title="Automated Follow-Ups"
                description="Intelligent drip campaigns keep every lead warm and conversion-ready."
              />
            </motion.ul>
            <motion.div custom={0.2} variants={fadeRight}>
              <CTAButton href="https://beta.maxtronize.com/signup" label="Join as an Asset Issuer" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
