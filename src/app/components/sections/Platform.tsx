"use client";

import { motion } from "framer-motion";
import { Network, Terms, AI } from "@/components/VectorImages";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

const featureItems = [
  {
    title: "Asset Management",
    icon: <Network className="w-10 h-10 text-[#4E449A]" />,
  },
  {
    title: "Portfolio Management",
    icon: <Terms className="w-10 h-10 text-[#4E449A]" />,
  },
  {
    title: "AI Asset Intelligence",
    icon: <AI className="w-10 h-10 text-[#4E449A]" />,
  },
];

export default function Platform() {
  return (
    <section id="platform-section" className="relative py-12 md:py-24 px-4 sm:px-10 lg:px-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
     
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-[36px] sm:text-[44px] md:text-[56px] font-semibold ">
            <span className="text-[#2D2D2D]">OUR </span>
            <span className="text-[#4E449A]">PLATFORM</span>
          </h2>
        </motion.div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr,2.8fr] gap-12 lg:gap-16 items-start">
         
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col justify-between items-center min-h-fit lg:min-h-[600px] py-10 lg:py-10 pr-0 gap-8 lg:gap-0"
          >
            {featureItems.map((item, index) => {
              const offsets = [
                 "translate-x-0 md:translate-x-8 lg:translate-x-24", 
                "translate-x-0 md:-translate-x-4 lg:-translate-x-12",  
                "translate-x-0 md:translate-x-8 lg:translate-x-24"     
              ];
              
              return (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.2 }}
                  className={`flex flex-col items-center gap-3 group text-center ${offsets[index]}`}
                >
                  <div className="shrink-0 transition-transform group-hover:scale-110 duration-300 items-end">
                    {item.icon}
                  </div>
                  <h4 className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-[#1A1A1A] font-teachers leading-tight">
                    {item.title}
                  </h4>
                </motion.div>
              );
            })}
          </motion.div>

         
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full"
          >
           
            <div className="relative w-full rounded-2xl overflow-hidden border-[2px] border-[#4E449A]/30 shadow-2xl bg-white">
              <div className="relative w-full aspect-square sm:aspect-square">
                <Image 
                  src="/images/dashboard.png" 
                  alt="Maxtronize Platform Dashboard"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}