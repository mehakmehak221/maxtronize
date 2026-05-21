"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Link2, Users, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Your own tokenization platform",
    description:
      "Our platform empowers you to issue, distribute, and manage tokens effortlessly, ensuring a seamless and compliant experience at every step.",
    image: "/images/future1.webp",
    icon: Store,
  },
  {
    title: "Tokenize any asset",
    description:
      "Convert real-world or digital assets into secure blockchain tokens effortlessly.",
    image: "/images/future2.webp",
    icon: Link2,
  },
  {
    title: "Scale your investor base",
    description:
      "Expand global reach and access more investors through tokenized assets.",
    image: "/images/future33.webp",
    icon: Users,
  },
];

export default function Future() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="future" className="relative bg-white py-6 sm:py-8 md:py-9 lg:py-10 overflow-hidden">
      <div className="mx-auto max-w-[96rem] px-4 sm:px-6 md:px-10 lg:px-20">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-[32px] sm:text-[36px] md:text-[48px] lg:text-[52px] font-semibold text-[#111111] leading-tight mb-12 sm:mb-16 md:mb-20 text-center lg:text-left"
        >
          The Future of <span className="text-[#513C9E]">RWAs</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
         
          <div className="flex flex-col w-full  mx-auto lg:mx-0">
            {features.map((feature, idx) => {
              const isActive = activeIndex === idx;
              const Icon = feature.icon;

              return (
                <div
                  key={idx}
                  className={`border-b border-gray-100 ${isActive ? "pb-2" : ""}`}
                >
                  <button
                    onClick={() => setActiveIndex(idx)}
                    className="flex w-full items-center justify-between py-3 sm:py-4 text-left focus:outline-none group"
                  >
                    <div className="flex items-center gap-4">
                      <Icon
                        className={`h-[22px] w-[22px] sm:h-6 sm:w-6 transition-colors duration-300 ${
                          isActive ? "text-[#513C9E]" : "text-[#888888] group-hover:text-[#513C9E]"
                        }`}
                      />
                      <span
                        className={`text-[16px] sm:text-[18px] md:text-[20px] font-medium transition-colors duration-300 ${
                          isActive ? "text-[#111111]" : "text-[#444444] group-hover:text-[#111111]"
                        }`}
                      >
                        {feature.title}
                      </span>
                    </div>
                    {isActive ? (
                      <ChevronUp className="h-5 w-5 text-[#513C9E]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#888888] group-hover:text-[#513C9E] transition-colors" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pl-10 md:pl-10 pb-6 pr-4">
                          <p className="text-[14px] sm:text-[15px] mb-6 leading-relaxed text-[#555555]">
                            {feature.description}
                          </p>

                          <Link
                            href="/sign-up"
                            className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-md bg-[#1A1A1A] px-5 py-2.5 text-[14px] font-medium text-white shadow-md transition-shadow hover:shadow-lg"
                          >
                            <motion.span
                              className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
                              initial={{ x: "0%" }}
                              animate={{ x: "0%" }}
                              transition={{ duration: 0.3 }}
                            />
                            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5">
                              Get Started
                            </span>
                            <span className="relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M16 5C16 5.742 16.733 6.85 17.475 7.78C18.429 8.98 19.569 10.027 20.876 10.826C21.856 11.425 23.044 12 24 12M24 12C23.044 12 21.855 12.575 20.876 13.174C19.569 13.974 18.429 15.021 17.475 16.219C16.733 17.15 16 18.26 16 19M24 12H0"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            </span>
                          </Link>

                          
                          <div className="mt-8 relative w-full aspect-[4/3] flex lg:hidden items-center justify-center overflow-hidden">
                            <motion.img
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                              src={feature.image}
                              alt={feature.title}
                              className="w-full h-full object-contain "
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

         
          <div className="hidden lg:flex relative lg:bottom-10 w-full lg:h-[400px] items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={activeIndex}
                src={features[activeIndex].image}
                alt={features[activeIndex].title}
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
