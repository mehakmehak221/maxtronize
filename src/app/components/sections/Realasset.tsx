"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Realasset() {
  return (
    <section className="w-full bg-white py-0">
      <div className="relative mx-auto w-full max-w-[96rem] overflow-hidden  rounded-md px-4  sm:px-6  md:px-10 lg:px-20">
        {/* Video Area */}
        <div className="relative min-h-[500px] w-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover rounded-md"
          >
            <source
              src="https://res.cloudinary.com/dxe74eowp/video/upload/v1776834188/realasset_vi2bop.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          <div
            className="absolute inset-0 rounded-md"
            style={{ backgroundColor: "#24167775" }}
          />

          <div className="relative z-10 flex min-h-[500px] flex-col items-center justify-center px-6 py-24 text-center md:py-32">
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-3xl text-[28px] font-medium leading-[1.2] text-white sm:text-[32px] md:text-[40px] lg:text-[48px]"
            >
              Transforming Real-World Assets Into Borderless Digital
              Opportunities
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.85,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-10"
            >
              <Link
                href="https://beta.maxtronize.com/signin"
                className="group inline-flex items-center gap-3 rounded-sm border border-white/80  px-8 py-3 text-[15px] font-medium transition-all duration-300 bg-white text-[#241677]"
              >
                <span>Invest Now</span>

                <span className="flex items-center transition-transform duration-200 group-hover:translate-x-1">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 5C16 5.742 16.733 6.85 17.475 7.78C18.429 8.98 19.569 10.027 20.876 10.826C21.856 11.425 23.044 12 24 12M24 12C23.044 12 21.855 12.575 20.876 13.174C19.569 13.974 18.429 15.021 17.475 16.219C16.733 17.15 16 18.26 16 19M24 12H0"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
