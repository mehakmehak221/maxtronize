"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";

export default function Bridge() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const bX = useMotionValue(0);
  const bY = useMotionValue(0);
  const bSpX = useSpring(bX, { damping: 20, stiffness: 300 });
  const bSpY = useSpring(bY, { damping: 20, stiffness: 300 });
  const [btnHovered, setBtnHovered] = useState(false);

  const onBtnMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    bX.set((e.clientX - (r.left + r.width / 2)) * 0.15);
    bY.set((e.clientY - (r.top + r.height / 2)) * 0.15);
  };
  const onBtnLeave = () => {
    bX.set(0);
    bY.set(0);
    setBtnHovered(false);
  };

  return (
    <section id="bridge" className="relative overflow-hidden bg-white py-10">
      <div className="mx-auto max-w-[96rem]  text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold text-[#111111] leading-tight"
        >
          Bridging Two <span className="text-[#513C9E]">Worlds</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-4 sm:mt-5 md:mt-6 text-[16px] sm:text-[18px] md:text-[20px] font-medium text-[#111111]"
        >
          The Evolution Of{" "}
          <span className="text-[#6452B0]">Real World Assets</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mx-auto  w-full max-w-[96rem]"
        >
          <img
            src="/images/bridge.webp"
            alt="Bridging Two Worlds - The Evolution of Real World Assets"
            className="w-full h-auto object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center "
        >
          <motion.a
            ref={btnRef}
            href="https://beta.maxtronize.com/signin"
            onMouseMove={onBtnMove}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={onBtnLeave}
            style={{ x: bSpX, y: bSpY }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-fit group relative inline-flex items-center gap-3 overflow-hidden rounded-md bg-[#1A1A1A] pl-5 pr-4 py-2.5 text-[14px] font-medium text-white shadow-md hover:shadow-lg"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
              initial={{ x: "0%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Join The Future</span>
            <span className="relative z-10 flex items-center justify-center transition-transform group-hover:translate-x-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 5C16 5.742 16.733 6.85 17.475 7.78C18.429 8.98 19.569 10.027 20.876 10.826C21.856 11.425 23.044 12 24 12M24 12C23.044 12 21.855 12.575 20.876 13.174C19.569 13.974 18.429 15.021 17.475 16.219C16.733 17.15 16 18.26 16 19M24 12H0"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
