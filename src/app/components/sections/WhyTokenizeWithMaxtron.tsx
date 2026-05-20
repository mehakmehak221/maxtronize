"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ContactModal from "./ContactModal";

const items = [
  {
    image: "/images/whyus1.webp",
    title: "We tokenize any asset",
    desc: "Whether you need tokenization for a small or large portfolio, we can design a solution that meets your requirements and delivers the results you need.",
  },
  {
    image: "/images/whyus2.png",
    title: "Hassle-free token management tools",
    desc: "Onboard investors, manage tokens, automate vesting schedules and transfers, end-to-end.",
  },
  {
    image: "/images/whyus3.webp",
    title: "Access both retail and accredited investors",
    desc: "We provide secure and compliant way for issuers and fund managers to raise capital through both security and utility tokens.",
  },
  {
    image: "/images/whyus4.webp",
    title: "Team with a track record",
    desc: "Collaborate with a team of experts from, who has a deep understanding of the legal, technical, and operational aspects of the tokenization process.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const WhyTokenizeWithMaxtron = () => {
    const router = useRouter();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  return (
    <div className="w-full bg-white" id="WhyTokenizeWithMaxtron">
      <div className="max-w-[96rem] mx-auto flex flex-col gap-5 md:gap-9 lg:gap-12 px-4 sm:px-6 lg:px-10 py-5 md:py-7 lg:py-10">
        <motion.p
          className="w-full text-center text-[#2A2A2A] font-teachers text-3xl lg:text-4xl xl:text-5xl mb-5 font-semibold leading-[160%] tracking-tight uppercase"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          Why tokenize with <span className="text-[#4E449A]">Maxtron?</span>
        </motion.p>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              y: -5,
              transition: { duration: 0.2 },
            }}
            className="relative p-4 md:p-5 lg:p-6 self-stretch bg-[#F7F7F7] rounded-3xl flex flex-col gap-4 lg:gap-5 cursor-pointer"
          >
            <h1 className="text-[#2A2A2A] font-switzer text-lg lg:text-2xl font-semibold leading-4 lg:leading-[30px] tracking-[-0.48px]">
              {item.title}
            </h1>
            <p className="text-[#2A2A2A] font-opensanshebrew text-base font-normal leading-5 lg:leading-6 tracking-[-0.16px]">
              {item.desc}
            </p>
            <div className="relative w-full h-36 md:h-44 lg:h-64 mt-auto">
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex justify-center mt-4 md:mt-6"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <motion.div whileHover="hover" initial="rest" animate="rest">
          <button
            onClick={() => router.push("/sign-in")}
            className="relative inline-flex items-center gap-2 bg-[#2A2A2A] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a1a1a] transition-colors overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
              initial={{ x: "0%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Invest Now</span>

            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 33 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
              variants={{
                rest: { x: 0 },
                hover: { x: 4 },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <g clipPath="url(#clip0_whytokenize)">
                <path d="M21.5205 6.72461C21.5205 7.72262 22.5064 9.21291 23.5044 10.4638C24.7875 12.0778 26.3209 13.4861 28.0788 14.5607C29.397 15.3664 30.9949 16.1398 32.2807 16.1398M32.2807 16.1398C30.9949 16.1398 29.3956 16.9132 28.0788 17.7189C26.3209 18.7949 24.7875 20.2031 23.5044 21.8145C22.5064 23.0667 21.5205 24.5597 21.5205 25.555M32.2807 16.1398H0" stroke="white" strokeWidth="2.69006" />
              </g>
              <defs>
                <clipPath id="clip0_whytokenize">
                  <rect width="32.2807" height="32.2807" fill="white" />
                </clipPath>
              </defs>
            </motion.svg>
          </button>
        </motion.div>
      </motion.div>
      </div>
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default WhyTokenizeWithMaxtron;