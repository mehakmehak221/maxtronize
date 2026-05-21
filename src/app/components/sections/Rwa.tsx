"use client";

import { motion, Variants, useScroll, useTransform, useInView } from "framer-motion";
import { Graph } from "../VectorImages";
import { useRef, useEffect, useState } from "react";

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

const letterVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98] as const
        }
    }
};

export default function Rwa() {
    const sectionRef = useRef(null);
    const numberRef = useRef(null);
    const isNumberInView = useInView(numberRef, { once: true });
    const [count, setCount] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);

    useEffect(() => {
        if (isNumberInView) {
            let start = 0;
            const end = 30;
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isNumberInView]);

    const title = "RWA IS THE FUTURE";

    return (
        <section 
            id="rwa" 
            ref={sectionRef}
            className="relative bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-20 lg:py-28 xl:px-32 font-teachers overflow-hidden"
        >
            <motion.div
                className="absolute top-10 left-5 h-24 w-24 rounded-full bg-purple-200/20 blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut" as const,
                }}
            />
            <motion.div
                className="absolute bottom-20 right-10 h-32 w-32 rounded-full bg-blue-200/20 blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut" as const,
                    delay: 1,
                }}
            />

            <motion.div
                className="absolute top-1/4 right-1/4 h-2 w-2 rounded-full bg-purple-400/40"
                animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut" as const,
                }}
            />
            <motion.div
                className="absolute top-1/3 left-1/3 h-3 w-3 rounded-full bg-blue-300/30"
                animate={{
                    y: [0, 40, 0],
                    x: [0, 20, 0],
                    opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut" as const,
                    delay: 1.5,
                }}
            />

            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col items-start"
                    style={{ opacity }}
                >
                 
                    <motion.div 
                        variants={titleVariants} 
                        className="space-y-0 sm:space-y-1 md:space-y-2"
                    >
                        <motion.h2 
                            ref={numberRef}
                            className="text-[56px] sm:text-[64px] md:text-[80px] lg:text-[100px] xl:text-[120px] font-medium italic leading-[0.85] text-black tracking-tighter relative"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ 
                                duration: 1, 
                                ease: [0.21, 0.47, 0.32, 0.98] as const 
                            }}
                            viewport={{ once: true }}
                        >
                            <motion.span
                                className="inline-block"
                                animate={{
                                    textShadow: [
                                        "0 0 0px rgba(0,0,0,0)",
                                        "0 0 20px rgba(122,53,193,0.3)",
                                        "0 0 0px rgba(0,0,0,0)"
                                    ]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut" as const
                                }}
                            >
                                ${count}T
                            </motion.span>
                            
                            <motion.div
                                className="absolute -bottom-2 left-0 h-1   rounded-full"
                                initial={{ width: 0 }}
                                whileInView={{ width: "40%" }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                
                                viewport={{ once: true }}
                            />
                        </motion.h2>

                        <motion.h3 
                            className="text-[20px] sm:text-[28px] md:text-[40px] lg:text-[52px] xl:text-[60px] font-medium italic uppercase leading-none text-black tracking-tight font-teachers"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.03,
                                        delayChildren: 0.5
                                    }
                                }
                            }}
                        >
                            {title.split('').map((char, index) => (
                                <motion.span
                                    key={index}
                                    variants={letterVariants}
                                    className="inline-block"
                                    style={{ display: 'inline-block' }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </motion.span>
                            ))}
                        </motion.h3>
                    </motion.div>

                    <motion.p 
                        variants={titleVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-[#999999] text-[12px] sm:text-[14px] md:text-[18px] lg:text-[22px] xl:text-[24px] font-medium max-w-2xl font-kode-mono leading-relaxed mt-4 sm:mt-5 md:mt-6 tracking-wide"
                    >
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="block"
                        >
                            RWAs Are Projected To Reach Multi-Trillion
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="block"
                        >
                            Scale By 2030 As Markets
                        </motion.span>
                    </motion.p>
                    
                   
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="w-full mt-8 sm:mt-10 md:mt-12 lg:-mt-8 xl:-mt-20 relative"
                        style={{ y }}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.7 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                            className="relative"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-purple-200/20 via-transparent to-transparent blur-2xl"
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut" as const
                                }}
                            />
                            
                            <Graph className="w-full h-auto relative z-10" />
                        </motion.div>

                       
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}