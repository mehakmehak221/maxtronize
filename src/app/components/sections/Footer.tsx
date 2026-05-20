"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#B49BD3_100%)]">
      
   
      <div className="relative z-10 max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 pt-10 md:pt-14 lg:pt-16 pb-14 md:pb-20 lg:pb-24">
        
    
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-5 lg:mb-10">
          
       
          <div className="relative w-40 h-14 sm:w-56 sm:h-16">
            <Image
              src="/images/newfooterlogo.png"
              alt="Maxtron Logo"
              fill
              className="object-contain object-left"
            />
          </div>

         <div className="flex flex-wrap items-center gap-6 sm:gap-10 md:gap-14 lg:gap-20 mb-12 relative top-5">
          
          <Link href="/" className="text-[#4A4A6A] text-sm hover:text-black transition">
            Home
          </Link>

          <Link href="#whyus" className="text-[#4A4A6A] text-sm hover:text-black transition">
            Why Us
          </Link>

          <Link href="#assets" className="text-[#4A4A6A] text-sm hover:text-black transition">
            Assets
          </Link>

          <Link
            href="https://maxtronize.gitbook.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4A4A6A] text-sm hover:text-black transition"
          >
            Whitepaper
          </Link>

          <Link
            href="https://calendly.com/maxtron-realasset"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4A4A6A] text-sm hover:text-black transition"
          >
            Contact Us
          </Link>
        </div>
        
        </div>

       

        <div className="border-t border-[#D6CCF5] mb-4"></div>

       
        <div className="flex flex-row justify-between items-start sm:items-center gap-3 text-xs text-[#8A8A8A]">
          <p>© {new Date().getFullYear()} Maxtronize</p>
          <Link href="/privacy-policy" className="hover:text-black transition">
            Privacy Policy
          </Link>
        </div>
      </div>

 
      <div className="pointer-events-none relative bottom-8  w-full text-center select-none">
        <p className="font-saira uppercase leading-none text-[60px] sm:text-[100px] md:text-[160px] lg:text-[200px] text-[var(--primary)] opacity-[0.08]">
          MAXTRONIZE
        </p>
      </div>
    </footer>
  );
};

export default Footer;