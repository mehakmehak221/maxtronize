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

const leaders = [
  {
    name: "Girish Ahirwar",
    role: "Founder & GP",
    image: "/girish.png",
    bio: [
      "A serial entrepreneur, angel investor, and strategic advisor with over a decade of experience building and scaling technology-led ventures across Web2, Web3, AI, and fintech.",
      "With 2 successful exits, Girish actively advises and partners with global startups and platforms focusing on blockchain, fundraising, investor relations, and cross-border strategy."
    ]
  },
  {
    name: "Hue Nguyễn",
    role: "GP",
    image: "/hue.png",
    bio: [
      "A global strategic advisor and impact-driven investor with deep expertise at the intersection of fintech, SEC regulation, and tokenization of real-world asset (RWA) infrastructure. With experience spanning Web3 and TradFi ecosystems.",
      "Hue brings a rare blend of regulatory insight, capital markets understanding, and hands-on execution across alternative and traditional asset classes."
    ]
  },
  {
    name: "Robert D. Sudon",
    role: "GP",
    image: "/robert.png",
    bio: [
      "A strategic & salesforce business development advisor in the focus areas of medical technology, construction project management and real estate deals, commodities, manufacturing and supply chain logistics.",
      "Bobby was instrumental in the growth of his family office business & Sudon Brothers Construction Company in the commercial and residential side. His distinguished career as an industry leader, architect mind and progressive idealist."
    ]
  }
];

export default function Leadership() {
  return (
    <section id="leadership" className="relative w-full bg-white py-12 md:py-20 lg:py-24 overflow-hidden">
    
      <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none ">
        <Image
          src="/leaderbg.png"
          alt="Leadership Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={staggerContainer}
           className="space-y-16"
        >
      
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-medium tracking-tight font-teachers text-[#1a1a1a] uppercase">
              OUR <span className="text-[#4E449A]">LEADERSHIP</span>
            </h2>
          </motion.div>

      
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex flex-col items-center bg-white border border-[#4E449AAD] rounded-md p-8 shadow-sm hover:shadow-md transition-shadow group"
              >
              
                <div className="relative w-32 h-32 md:w-36 md:h-36 mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#4E449A]/10 to-transparent scale-110 blur-sm group-hover:scale-125 transition-transform duration-500" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-slate-50">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                
                <div className="text-center mb-6 space-y-1">
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-[#1a1a1a] font-teachers">
                    {leader.name}
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-[#4E449A]/70 font-medium tracking-wide uppercase">
                    {leader.role}
                  </p>
                </div>

              
                <div className="space-y-4">
                  {leader.bio.map((paragraph, pIndex) => (
                    <p 
                      key={pIndex} 
                      className="text-[14px] md:text-[15px] text-slate-600 leading-relaxed text-center font-inter"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        
          <motion.div variants={fadeInUp} className="pt-4 flex justify-start">
             <motion.a
                href="https://www.maxtron.ai/our-team"
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-fit group relative flex items-center gap-3 rounded-md bg-[#1A1A1A] pl-5 pr-4 py-2.5 text-[14px] font-medium text-white transition-all shadow-md hover:shadow-lg overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
                  initial={{ x: "0%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Our Team</span>
                <span className="relative z-10 flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                        d="M16 5C16 5.742 16.733 6.85 17.475 7.78C18.429 8.98 19.569 10.027 20.876 10.826C21.856 11.425 23.044 12 24 12M24 12C23.044 12 21.855 12.575 20.876 13.174C19.569 13.974 18.429 15.021 17.475 16.219C16.733 17.15 16 18.26 16 19M24 12H0" 
                        stroke="white" 
                        strokeWidth="2"
                    />
                  </svg>
                </span>
              </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
