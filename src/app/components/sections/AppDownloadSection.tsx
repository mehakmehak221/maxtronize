"use client";

import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import ContactModal from "./ContactModal";

const AppDownloadSection = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <section className="w-full bg-white py-20 lg:py-24 relative overflow-hidden font-teachers">
    
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[1px] border-[#4E449A]/5 rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-[#4E449A]/10 text-[#4E449A] text-xs font-bold uppercase tracking-[0.2em] mb-6 font-inter">
              Mobile App
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1a1a1a] mb-6 leading-tight uppercase">
              COMING SOON
            </h2>
            
            <p className="text-gray-500 text-base md:text-lg mb-10 max-w-lg leading-relaxed font-inter">
              We will be available on iOS and Android soon. 
              Experience the future of real-world asset tokenization on the go.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
             
              <div className="group relative">
                <div className="absolute -top-2 -right-1 bg-[#4E449A] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10">
                  SOON
                </div>
                <div className="flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-xl opacity-50 grayscale transition-all">
                  <svg className="w-6 h-6 fill-[#1a1a1a]" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-gray-400 uppercase font-bold leading-none mb-0.5 font-inter">Available on</p>
                    <p className="text-base text-[#1a1a1a] font-semibold leading-none font-inter">App Store</p>
                  </div>
                </div>
              </div>

            
              <div className="group relative">
                <div className="absolute -top-2 -right-1 bg-[#4E449A] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10">
                  SOON
                </div>
                <div className="flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-xl opacity-50 grayscale transition-all">
                  <svg className="w-6 h-6 fill-[#1a1a1a]" viewBox="0 0 640 640">
                    <path d="M389.6 298.3L168.9 77L449.7 238.2L389.6 298.3zM111.3 64C98.3 70.8 89.6 83.2 89.6 99.3L89.6 540.6C89.6 556.7 98.3 569.1 111.3 575.9L367.9 319.9L111.3 64zM536.5 289.6L477.6 255.5L411.9 320L477.6 384.5L537.7 350.4C555.7 336.1 555.7 303.9 536.5 289.6zM168.9 563L449.7 401.8L389.6 341.7L168.9 563z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-gray-400 uppercase font-bold leading-none mb-0.5 font-inter">Available on</p>
                    <p className="text-base text-[#1a1a1a] font-semibold leading-none font-inter">Google Play</p>
                  </div>
                </div>
              </div>
            </div>

            
          </motion.div>

        
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.21, 0.45, 0.32, 0.9] }}
            className="relative flex justify-center lg:justify-end"
          >
           
            <div className="relative w-full max-w-[260px] aspect-[9/18.5] bg-[#0A0A0A] rounded-[3rem] border-[8px] border-[#1a1a1a] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] overflow-hidden">
              
            
              <div className="absolute inset-0 bg-[#F8F9FF] flex flex-col pt-12 overflow-hidden">
                
              
                <div className="px-4 mb-6">
                  <div className="bg-white rounded-full border border-gray-100 py-2 px-4 flex items-center gap-3 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <span className="text-xs text-gray-400">Search...</span>
                  </div>
                </div>

               
                <div className="px-4 mb-6">
                  <h3 className="text-[#4E449A] text-xl font-bold mb-1">Discover Assets</h3>
                  <p className="text-[9px] text-gray-500 leading-tight">Institutional-grade real estate. Digitally simplified.</p>
                </div>

                
                <div className="flex gap-2 px-4 mb-8 overflow-x-auto no-scrollbar">
                  <div className="px-4 py-1.5 bg-[#4E449A] text-white text-[9px] font-bold rounded-full whitespace-nowrap">All</div>
                  <div className="px-4 py-1.5 bg-[#4E449A]/5 text-[#4E449A] text-[9px] font-bold rounded-full border border-[#4E449A]/10 whitespace-nowrap">Dubai Skyscrapers</div>
                </div>

                
                <div className="px-4 mb-6">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="h-28 relative overflow-hidden">
                      <Image 
                        src="/images/building.webp" 
                        alt="Burj Vista Tower" 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[7px] font-bold uppercase text-[#4E449A]">Dubai Skyscrapers</div>
                      <div className="absolute top-2 right-2 bg-yellow-400 px-2 py-0.5 rounded text-[7px] font-bold uppercase text-white shadow-sm">Medium</div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-base font-bold text-gray-900 mb-0.5">Burj Vista Tower</h4>
                      <p className="text-[8px] text-gray-500 mb-4 flex items-center gap-1">
                        <svg className="w-2 h-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                        Downtown Dubai, UAE
                      </p>
                      
                      <div className="grid grid-cols-2 gap-y-3 mb-4">
                        <div>
                          <p className="text-[7px] text-gray-400 font-bold uppercase mb-0.5">Valuation</p>
                          <p className="text-xs font-bold text-gray-900">$250.0M</p>
                        </div>
                        <div>
                          <p className="text-[7px] text-gray-400 font-bold uppercase mb-0.5">Per Fraction</p>
                          <p className="text-xs font-bold text-gray-900">$25K</p>
                        </div>
                      </div>

                      <div className="w-full h-1 bg-gray-100 rounded-full mb-1">
                        <div className="w-[68%] h-full bg-[#4E449A] rounded-full" />
                      </div>
                      <p className="text-[7px] text-gray-500 mb-4 font-bold">68% funded</p>

                      <div className="w-full py-2 bg-[#4E449A] text-white text-[9px] font-bold rounded-lg text-center">Invest Now</div>
                    </div>
                  </div>
                </div>

                {/* Card 2 Peeking */}
                <div className="px-4 opacity-50">
                  <div className="bg-white rounded-2xl border border-gray-100 h-20" />
                </div>
              </div>

              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a1a] rounded-b-[1.5rem] z-30" />
            </div>

            
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[#4E449A]/5 rounded-full blur-[100px]" />
          </motion.div>

        </div>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </section>
  );
};

export default AppDownloadSection;
