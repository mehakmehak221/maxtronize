"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, Variants, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import ContactModal from "./ContactModal";

const assets = [
  { src: "/images/car.webp", alt: "Luxury car" },
  { src: "/images/building.webp", alt: "City skyline" },
  { src: "/images/gold.webp", alt: "Gold bars" },
  { src: "/images/stocks.webp", alt: "Market data" },
  { src: "/images/yacht.webp", alt: "Yacht and villa" },
];

export default function Tokenization() {
  const sectionRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const buttonX = useMotionValue(0);
  const buttonY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 300 };
  const buttonSpringX = useSpring(buttonX, springConfig);
  const buttonSpringY = useSpring(buttonY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    buttonX.set((e.clientX - centerX) * 0.15);
    buttonY.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    buttonX.set(0);
    buttonY.set(0);
    setIsButtonHovered(false);
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] as const } 
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const wordAnimation: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.21, 0.45, 0.32, 0.9] as const
      }
    }
  };

  const title1 = "BUILDING MARKET INFRASTRUCTURE FOR";
  const title2 = "TOKENIZED REAL-WORLD ASSETS";

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-white py-8 sm:py-10 md:py-20 lg:py-24 overflow-hidden font-teachers"
    >
      
      <motion.div
        className="absolute top-20 left-10 h-32 w-32 rounded-full bg-purple-200/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-blue-200/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 1,
        }}
      />

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 text-center"
        style={{ opacity }}
      >
        
        <motion.div 
          variants={fadeInUp} 
          className="max-w-6xl mx-auto space-y-2 sm:space-y-3 md:space-y-4"
        >
          <motion.h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-wide text-slate-900 leading-tight"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {title1.split(' ').map((word, index) => (
              <motion.span
                key={index}
                variants={wordAnimation}
                className="inline-block mr-2 sm:mr-3"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
          
          <motion.p 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-wide text-[#4E449A] leading-tight"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {title2.split(' ').map((word, index) => (
              <motion.span
                key={index}
                variants={wordAnimation}
                className="inline-block mr-2 sm:mr-3"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>

      
        <motion.button 
          ref={buttonRef}
          variants={fadeInUp}
          onClick={() => setIsContactModalOpen(true)}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{ x: buttonSpringX, y: buttonSpringY }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative mt-8 sm:mt-10 md:mt-12 lg:mt-14 inline-flex items-center gap-2 sm:gap-3 rounded-md bg-black px-7 md:px-8 py-3 text-base sm:text-base md:text-base font-medium text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-2xl group overflow-hidden"
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
            initial={{ x: "0%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">Tokenize with Us</span>
          <motion.span 
            className="relative z-10 text-base sm:text-lg leading-none"
            animate={{ x: isButtonHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="20" height="12" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[24px] sm:h-[14px]">
              <path d="M16 0C16 0.742 16.733 1.85 17.475 2.78C18.429 3.98 19.569 5.027 20.876 5.826C21.856 6.425 23.044 7 24 7M24 7C23.044 7 21.855 7.575 20.876 8.174C19.569 8.974 18.429 10.021 17.475 11.219C16.733 12.15 16 13.26 16 14M24 7H0" stroke="white" strokeWidth="2"/>
            </svg>
          </motion.span>
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="mt-12 sm:mt-14 md:mt-16 lg:mt-20 w-full  px-4 sm:px-6 lg:px-10 overflow-hidden py-10"
        style={{ y }}
      >
        <motion.div 
          className="flex gap-4 sm:gap-5 md:gap-6 w-max"
          animate={{ x: "-50%" }}
          transition={{ 
            ease: "linear" as const, 
            duration: 40, 
            repeat: Infinity,
            repeatType: "loop" as const
          }}
        >
          
          {[...assets, ...assets, ...assets, ...assets].map((asset, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -15, scale: 1.03 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              className="relative flex-none h-48 w-40 sm:h-56 sm:w-48 md:h-72 md:w-60 lg:h-80 lg:w-72 overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] cursor-pointer group"
            >
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/20 group-hover:via-purple-500/10 transition-all duration-500 z-10"
              />
              
              
              <Image
                src={asset.src}
                alt={asset.alt}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 240px, 288px"
              />
              
             
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              
             
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </section>
  );
}