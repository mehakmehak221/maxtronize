"use client";

import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { Focus as FocusIcon } from "../VectorImages";
import { useRef } from "react";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.21, 0.47, 0.32, 0.98] as const
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

export default function Focus() {
    const sectionRef = useRef(null);
    const title = "OUR FOCUS";

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const globeY = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);

    return (
        <section 
            id="focus" 
            ref={sectionRef}
            className="relative bg-[#7F78B0] px-4 pt-16 pb-0 sm:px-6 sm:pt-20 md:px-10 md:pt-24 lg:px-20 lg:pt-28 xl:px-32 font-teachers overflow-hidden"
        >
           
            <motion.div
                className="absolute top-10 left-10 h-32 w-32 md:h-64 md:w-64 rounded-full bg-white/10 blur-3xl"
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
                className="absolute top-20 right-10 h-40 w-40 md:h-80 md:w-80 rounded-full bg-purple-300/10 blur-3xl"
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
                className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-white/30"
                animate={{
                    y: [0, -40, 0],
                    x: [0, 20, 0],
                    opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut" as const,
                }}
            />
            <motion.div
                className="absolute top-1/3 right-1/3 h-3 w-3 rounded-full bg-purple-200/40"
                animate={{
                    y: [0, 30, 0],
                    x: [0, -15, 0],
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
                    variants={containerVariants}
                    className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12"
                    style={{ opacity }}
                >
                    
                    <motion.div variants={itemVariants} className="relative z-30 mb-12 sm:mb-16 md:mb-20">
                        <motion.h2 
                            className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[52px] font-medium leading-[0.85] text-center text-[#FFFFFF] tracking-tighter font-teachers"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05,
                                        delayChildren: 0.3
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
                        </motion.h2>

                       
                        <motion.div
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "80%" }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            viewport={{ once: true }}
                        />
                    </motion.div>

                   
                    <motion.div 
                        variants={itemVariants}
                        className="relative z-20 w-full max-w-[320px] sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto"
                        style={{ y: globeY }}
                    >
                        
                        <motion.div
                            className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150"
                            animate={{
                                scale: [1.5, 1.7, 1.5],
                                opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut" as const,
                            }}
                        />

                        
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut" as const,
                            }}
                            className="relative z-10"
                        >
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ 
                                    duration: 1, 
                                    delay: 0.5,
                                    ease: [0.21, 0.47, 0.32, 0.98] as const
                                }}
                                viewport={{ once: true }}
                                whileHover={{ 
                                    scale: 1.05,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <FocusIcon className="w-full h-auto drop-shadow-2xl" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

