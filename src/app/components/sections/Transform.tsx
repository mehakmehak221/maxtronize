"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ContactModal from "./ContactModal";

const Transform = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  return (
    <div className="w-full bg-white">
      <div className="max-w-[96rem] mx-auto px-2 sm:px-3 lg:px-10 py-5 md:py-7 lg:py-10">
        <div className="relative w-full max-w-[96rem] mx-auto h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[30rem] overflow-hidden rounded-md">
       
        <Image
          src="/images/tokenize.webp"
          alt="Tokenize background"
          fill
          unoptimized
          className="object-cover"
          priority
        />
  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] lg:backdrop-blur-[0px]"></div>

        <div className="relative z-10 h-full flex flex-col justify-center items-start gap-6 md:gap-8 lg:gap-10 xl:gap-14 px-4 sm:px5 md:px-9 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}

          >
            <h2 className="text-white font-teachers  text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-tight lg:leading-[1.2] tracking-tight">
              Transform Real-World Assets,
            </h2>
            <h2 className="text-white font-teachers  text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-tight lg:leading-[1.2] tracking-tight">
              Tokenize With Us
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover="hover"
          >
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="relative inline-flex items-center gap-3 bg-white py-2.5 md:py-3 px-5 md:px-6 rounded-md hover:bg-gray-100 transition-colors overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 "
                initial={{ x: "0%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 text-[#57339D] font-inter font-semibold text-sm md:text-base">
                Get Started
              </span>
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
                variants={{
                  hover: { x: 4 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <g clipPath="url(#clip0_transform)">
                  <path d="M21.5205 6.72461C21.5205 7.72262 22.5064 9.21291 23.5044 10.4638C24.7875 12.0778 26.3209 13.4861 28.0788 14.5607C29.397 15.3664 30.9949 16.1398 32.2807 16.1398M32.2807 16.1398C30.9949 16.1398 29.3956 16.9132 28.0788 17.7189C26.3209 18.7949 24.7875 20.2031 23.5044 21.8145C22.5064 23.0667 21.5205 24.5597 21.5205 25.555M32.2807 16.1398H0" stroke="#57339D" strokeWidth="2.69006" />
                </g>
                <defs>
                  <clipPath id="clip0_transform">
                    <rect width="32.2807" height="32.2807" fill="white" />
                  </clipPath>
                </defs>
              </motion.svg>
            </button>
          </motion.div>
        </div>
      </div>
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      </div>
    </div>
  );
};

export default Transform;
