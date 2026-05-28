"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center">
      <video
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover hidden xl:block rounded-md"
      >
        <source
          src="https://res.cloudinary.com/dxe74eowp/video/upload/v1776836845/herobg_bfgce6.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Mobile / Tablet Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover block xl:hidden rounded-md"
      >
        <source
          src="https://res.cloudinary.com/dxe74eowp/video/upload/v1776836583/mobileherobg1_nwcxmq.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(91deg,#391F6B_4.02%,rgba(87,51,157,0.12)_99.45%)]" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-[600px]"
        >
          <h1 className="text-white text-[42px] font-semibold sm:text-[52px] md:text-[60px] lg:text-[64px] leading-[1.1] font-light tracking-tight">
            Tokenize The Whole
            <br />
            World Profitably
          </h1>

          <p className="mt-6 text-white text-[18px] md:text-[20px] leading-relaxed">
            Invest In Real-World Assets
            <br />
            With Maxtronize
          </p>

          <div className="mt-8 flex items-center gap-4">
            <motion.a
              href="https://beta.maxtronize.com/signin"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative overflow-hidden px-6 py-3 bg-white text-black text-sm font-medium rounded-sm shadow-md"
            >
              <span className="relative z-10">Get started</span>

              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.a>

            <motion.a
              href="https://calendly.com/maxtron-realasset"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative overflow-hidden px-6 py-3 border border-white text-white text-sm font-medium rounded-sm"
            >
              <span className="relative z-10">Book a demo</span>

              <motion.span
                className="absolute inset-0 bg-white"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: "left" }}
              />

              <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition duration-300">
                Book a demo
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
