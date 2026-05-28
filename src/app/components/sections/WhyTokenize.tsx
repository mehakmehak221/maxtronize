"use client";

import { motion, Variants, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { Terms, Accessibility, Costs, Transparency, Times, Global } from "../VectorImages";
import { useRef, useState } from "react";
import ContactModal from "./ContactModal";

const features = [
  {
    icon: Terms,
    title: "Programmable Terms",
    description: "Program transfer restrictions and investment terms across different asset classes and investor KYC categories."
  },
  {
    icon: Accessibility,
    title: "Increased Accessibility",
    description: "Tokenization broadens investment opportunities, including retail investors previously excluded from traditional investment structures."
  },
  {
    icon: Costs,
    title: "Lower Costs",
    description: "Tokenization reduces costs such as custody, transfer, and administration, resulting in lower fees for investors and increased returns for fund managers."
  },
  {
    icon: Transparency,
    title: "Greater Transparency",
    description: "Investors can track their token ownership and access real-time information on fund performance and holdings."
  },
  {
    icon: Times,
    title: "Faster Settlement Times",
    description: "Tokenization speeds up trade settlements, enabling investors to receive their funds faster after selling their shares in the fund."
  },
  {
    icon: Global,
    title: "Global Reach",
    description: "Tokenization enables investors from around the world to invest in the fund, providing greater access to international capital."
  }
];

export default function WhyTokenize() {
  const sectionRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

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

  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y = useTransform(smoothProgress, [0, 1], [50, -50]);



  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.7, 
        ease: [0.21, 0.47, 0.32, 0.98] as const
      }
    },
    hover: {
      y: -8,
      scale: 1.01,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 1,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section 
      id="why-tokenize" 
      ref={sectionRef}
      className="relative bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-20 lg:py-28 xl:px-32 font-teachers overflow-hidden"
    >
      
      <motion.div
        className="absolute top-20 right-10 h-40 w-40 rounded-full bg-purple-100/40 blur-3xl transform-gpu"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-40 left-10 h-32 w-32 rounded-full bg-blue-100/30 blur-3xl transform-gpu"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="mx-auto max-w-7xl">
       
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <motion.h2 
            variants={titleVariants}
            className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[52px] font-semibold tracking-[0.1em] md:tracking-[0.15em] text-[#222222] uppercase"
          >
            WHY TOKENIZE?
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "circOut" as const }}
            className="h-1 w-16 sm:w-20 md:w-24 bg-[#7A35C1] mx-auto mt-3 sm:mt-4 rounded-full origin-center"
          />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 sm:gap-10 md:gap-12 lg:gap-x-16 lg:gap-y-16 md:grid-cols-2"
          style={{ y }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover="hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col items-start group relative p-4 sm:p-6 rounded-2xl will-change-transform transform-gpu"
            >
              <motion.div 
                className="mb-6 sm:mb-7 md:mb-8 relative"
                variants={{
                  hover: { rotate: [0, -10, 10, 0], scale: 1.15 }
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-[#7A35C1]/10 blur-2xl rounded-full"
                  variants={{
                    initial: { scale: 0, opacity: 0 },
                    hover: { scale: 1.5, opacity: 1 }
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#7A35C1]/30"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                <feature.icon className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 relative z-10 transform-gpu group-hover:drop-shadow-lg" />
              </motion.div>
              
              <motion.h3 
                className="mb-3 sm:mb-4 md:mb-5 text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-semibold font-switzer text-[#202020] tracking-tight transition-colors duration-200"
                variants={{
                  hover: { color: "#7A35C1" }
                }}
              >
                {feature.title}
              </motion.h3>
              
              <motion.p 
                className="max-w-xl text-base sm:text-[15px] md:text-[16px] lg:text-[17px] leading-[1.6] md:leading-[1.7] text-[#2A2A2A] font-light font-open-sans"
              >
                {feature.description}
              </motion.p>

              <motion.div 
                className="absolute -left-2 sm:-left-4 md:-left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#7A35C1] via-[#9B59D3] to-transparent rounded-full hidden md:block origin-top transform-gpu"
                variants={{
                  initial: { scaleY: 0 },
                  hover: { scaleY: 1 }
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />

             
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl pointer-events-none"
                variants={{
                  initial: { x: "-100%" },
                  hover: { x: "100%" }
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.div>
          ))}
        </motion.div>

        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 md:mt-24 text-center"
        >
          <motion.button
            ref={buttonRef}
            onClick={() => setIsContactModalOpen(true)}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{ x: buttonSpringX, y: buttonSpringY }}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 sm:gap-4 rounded-full bg-[#1A1A1A] px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 text-base sm:text-[14px] md:text-[16px] font-medium text-white shadow-xl hover:bg-black hover:shadow-2xl font-inter overflow-hidden transform-gpu"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
              initial={{ x: "0%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">List Your Assets</span>
            <motion.span 
              className="relative z-10 text-lg sm:text-xl md:text-2xl"
              variants={{
                initial: { x: 0 },
                hover: { x: 5 }
              }}
              transition={{ duration: 0.3 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px]">
                <path d="M16 5C16 5.742 16.733 6.85 17.475 7.78C18.429 8.98 19.569 10.027 20.876 10.826C21.856 11.425 23.044 12 24 12M24 12C23.044 12 21.855 12.575 20.876 13.174C19.569 13.974 18.429 15.021 17.475 16.219C16.733 17.15 16 18.26 16 19M24 12H0" stroke="white" strokeWidth="2"/>
              </svg>
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </section>
  );
}
