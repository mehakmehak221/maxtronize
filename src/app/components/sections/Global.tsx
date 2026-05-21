"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";


const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.21, 0.45, 0.32, 0.9]
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    }
  }
};

export default function Global() {
  return (
      <section id="global-nodes" className="relative w-full bg-white py-16 md:py-24 lg:py-32 overflow-hidden">
      
      <div className="absolute top-0 left-1/4 w-96 h-96 blur-[100px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 blur-[100px] rounded-full translate-y-1/2" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10 bg-white">
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={staggerContainer}
           className="flex flex-col items-center space-y-12 md:space-y-16 "
        >
      
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <h2 className="text-[28px] sm:text-[34px] md:text-[42px] lg:text-[48px] font-medium tracking-tight font-teachers text-[#1a1a1a] uppercase leading-tight">
              <span className="text-[#4E449A]">GLOBAL</span> OPERATIONAL NODES
            </h2>
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "120px", opacity: 0.3 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-transparent via-[#4E449A] to-transparent mx-auto rounded-full"
            />
          </motion.div>

          
          <motion.div 
            variants={fadeInUp}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-[4542/2412] max-w-6xl mx-auto drop-shadow-[0_25px_60px_rgba(78,68,154,0.12)] rounded-2xl md:p-6 lg:p-8 backdrop-blur-[2px]"
          >
            <Image
              src="/maxtronmap1.png"
              alt="Global Operational Nodes Map"
              fill
              className="object-contain"
              sizes="(max-width: 1440px) 100vw, 1200px"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
