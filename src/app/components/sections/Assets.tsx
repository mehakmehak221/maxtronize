"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, Accessibility, Terms } from "../VectorImages";
import Image from "next/image";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.2
    }
  },
  viewport: { once: true }
};

interface AssetCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  imagePath: string;
  isReverse?: boolean;
  href?: string;
}

const AssetCard = ({ title, description, buttonText, icon, imagePath, href = "/sign-in" }: AssetCardProps) => {
  return (
    <motion.div 
      variants={fadeInUp}
      className="flex flex-col gap-6 border-[1px] border-[#ECE8FF] rounded-md  p-3 sm:p-4 lg:p-6 bg-[#FEFDFF]"
    >
      <div className="flex flex-col gap-4 w-full  items-center">
       
        <div className="w-16 h-16 flex items-center justify-center text-primary-300">
          {icon}
        </div>
        
      
        <div className="space-y-3">
          <h3 className="text-[20px] font-bold text-center text-[#111111]">
            {title}
          </h3>
          <p className="text-[14px] leading-relaxed text-[#555555] max-w-[420px]">
            {description}
          </p>
        </div>

       
        <Link 
          href={href}
          className="group relative mt-2 w-fit inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-all hover:bg-black hover:shadow-lg overflow-hidden"
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
            initial={{ x: "0%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">{buttonText}</span>
      <motion.span
  className="relative z-10 flex items-center justify-center"
  whileHover={{ x: 4 }}
  transition={{ duration: 0.2 }}
>
  <svg
    viewBox="0 0 24 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[14px] h-[9px] sm:w-[16px] sm:h-[10px] md:w-[18px] md:h-[11px] lg:w-[20px] lg:h-[12px]"
  >
    <path
      d="M16 0C16 0.742 16.733 1.85 17.475 2.78C18.429 3.98 19.569 5.027 20.876 5.826C21.856 6.425 23.044 7 24 7M24 7C23.044 7 21.855 7.575 20.876 8.174C19.569 8.974 18.429 10.021 17.475 11.219C16.733 12.15 16 13.26 16 14M24 7H0"
      stroke="white"
      strokeWidth="2"
    />
  </svg>
</motion.span>
        </Link>
      </div>

     
      <div className="mt-4 relative w-full aspect-[16/9]  overflow-hidden">
    
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        
        <div className="relative w-full h-full p-4 sm:p-6 flex items-center justify-center">
            <Image 
                src={imagePath} 
                alt={title}
                fill
                className="object-contain "
                priority
            />
        </div>
      </div>
    </motion.div>
  );
};

export default function Assets() {
  return (
    <section id="assets-section" className="relative py-20 px-6 sm:px-10 lg:px-20 bg-white overflow-hidden">
      <div className="max-w-[96rem] mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-semibold tracking-tight text-left">
            <span className="text-[#6653AF]">MAXTRONIZE</span>{" "}
            <span className="text-[#111111]">YOUR ASSETS</span>
          </h2>
        </motion.div>

       
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20"
        >
        
          <AssetCard
            title="For Investors"
            description="Access tokenized assets across real estate, commodities, and private markets. Build and manage your portfolio with full visibility."
            buttonText="Explore Assets"
            icon={<Terms className="w-12 h-12" />}
            imagePath="/images/assets.webp"
          />


          <AssetCard
            title="For Asset Owners"
            description="Tokenize real-world assets, structure ownership, and distribute to a global investor base through a compliant infrastructure."
            buttonText="Tokenize Assets"
            icon={<Accessibility className="w-12 h-12" />}
            imagePath="/images/investor.webp"
          />
        </motion.div>
      </div>

      
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary-100/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-blue-100/20 blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
}
