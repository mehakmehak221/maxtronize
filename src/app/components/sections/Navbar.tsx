"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import ContactModal from "./ContactModal";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const floatingAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] md:w-[85%] lg:w-[80%] xl:w-[75%] max-w-[96rem] mx-auto z-50 flex items-center justify-between px-3 lg:px-6 py-2 lg:py-4 rounded-xl border backdrop-blur-xl transition-all duration-500 ease-in-out md:px-10 md:pt-5 md:pb-4 ${isScrolled
          ? "bg-white/90 border-[#000000]/20 shadow-xl"
          : "bg-white border-[#000000]/10 shadow-md"
          }`}
      >
        <Link href="/">
          <motion.div
            variants={itemVariants}
            className="group flex cursor-pointer items-center gap-3"
          >
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="relative h-10 w-36 lg:w-48"
            >
              <motion.div className="relative h-full w-full">
                <Image
                  src="/images/new-main-logo.png"
                  alt="Maxtronize"
                  fill
                  unoptimized
                  className="object-contain transition-all duration-300 group-hover:brightness-110"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </Link>

        <motion.div variants={itemVariants} className="hidden xl:block">
          <NavLink href="/#tokenize" label="Why Tokenize" delay={0.3} />
        </motion.div>
        <motion.div variants={itemVariants} className="hidden xl:block">
          <NavLink href="https://maxtronize.gitbook.io/maxtronize-whitepaper" label="Whitepaper" delay={0.4} />
        </motion.div>
        <motion.div variants={itemVariants} className="hidden xl:block">
          <NavLink href="/tokenomics" label="Tokenomics" delay={0.45} active={pathname === "/tokenomics"} />
        </motion.div>
        <motion.div variants={itemVariants} className="hidden xl:block">
          <NavLink href="/roadmap" label="Roadmap" delay={0.48} active={pathname === "/roadmap"} />
        </motion.div>
        <motion.div variants={itemVariants} className="hidden xl:block">
          <NavLink href="https://presale.maxtronize.com/" label="Presale" delay={0.5} target="_blank" />
        </motion.div>
        {/* <motion.div variants={itemVariants} className="hidden xl:block">
          <NavLink href="/asset_register" label="Asset Register" delay={0.45} active={pathname === "/asset_register"} />
        </motion.div> */}
        <motion.div variants={itemVariants} className="hidden xl:block">
          <NavLink href="/#leadership" label="About Us" delay={0.4} />
        </motion.div>
        <motion.div variants={itemVariants} className="hidden xl:block">
          <NavLink
            href="https://calendly.com/maxtronize/30min"
            label="Contact"
            delay={0.5}
            target="_blank"
            rel="noopener noreferrer"
          />
        </motion.div>

        <motion.button
          variants={itemVariants}
          className="group relative z-50 flex h-5 lg:h-6 w-8 flex-col justify-between xl:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="h-[2px] w-full bg-[#222222]"
            animate={{
              rotate: isMobileMenuOpen ? 45 : 0,
              y: isMobileMenuOpen ? 10 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.77, 0, 0.175, 1] }}
          />
          <motion.span
            className="h-[2px] w-full bg-[#222222]"
            animate={{
              opacity: isMobileMenuOpen ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="h-[2px] w-full bg-[#222222]"
            animate={{
              rotate: isMobileMenuOpen ? -45 : 0,
              y: isMobileMenuOpen ? -12 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.77, 0, 0.175, 1] }}
          />
        </motion.button>
      </motion.nav>


      <motion.div
        initial={false}
        animate={{
          y: isMobileMenuOpen ? 0 : "-100%",
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.77, 0, 0.175, 1],
        }}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl"
        style={{ pointerEvents: isMobileMenuOpen ? "auto" : "none" }}
      >
        <motion.div
          className="flex flex-col items-center gap-6 sm:gap-8 pt-16"
          variants={{
            open: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              },
            },
            closed: {
              transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
              },
            },
          }}
          initial="closed"
          animate={isMobileMenuOpen ? "open" : "closed"}
        >
          {/* <MobileNavLink
            href="/asset_register"
            label="Asset Register"
            onClick={() => setIsMobileMenuOpen(false)}
          /> */}
          <MobileNavLink
            href="https://presale.maxtronize.com/"
            label="Presale"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileNavLink
            href="/#tokenize"
            label="Why Tokenize"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileNavLink
            href="/#leadership"
            label="About Us"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileNavLink
            href="https://maxtronize.gitbook.io/maxtronize-whitepaper"
            label="Whitepaper"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileNavLink
            href="/tokenomics"
            label="Tokenomics"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileNavLink
            href="/roadmap"
            label="Roadmap"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileNavLink
            href="https://calendly.com/maxtronize/30min"
            label="Contact"
            onClick={() => setIsMobileMenuOpen(false)}
            target="_blank"
            rel="noopener noreferrer"
          />
        </motion.div>


        <motion.div
          className="absolute left-10 top-20 h-32 w-32 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-200/30 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>


      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}

const NavLink = ({
  href,
  label,
  delay = 0,
  target,
  rel,
  active = false,
  className = "text-[14px]",
}: {
  href: string;
  label: string;
  delay?: number;
  target?: string;
  rel?: string;
  active?: boolean;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const isInternal = href.startsWith("/") || href.startsWith("#");
  const MotionLink = motion(Link);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      target={target}
      rel={rel}
      className={`group relative font-medium uppercase tracking-wider transition-colors duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        color: isHovered || active ? "#000000" : "#222222"
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      {label}
      <motion.span
        className="absolute -bottom-1 left-0 h-[2px] bg-black"
        initial={{ width: 0 }}
        animate={{ width: isHovered || active ? "100%" : 0 }}
        transition={{ duration: 0.4, ease: [0.77, 0, 0.175, 1] }}
      />
    </motion.a>
  );
};

const MobileNavLink = ({
  href,
  label,
  onClick,
  target,
  rel,
}: {
  href: string;
  label: string;
  onClick: () => void;
  target?: string;
  rel?: string;
}) => {
  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.a
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      variants={itemVariants}
      className="relative overflow-hidden text-xl sm:text-2xl font-medium uppercase tracking-wider text-[#222222] py-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <span
        className="relative z-10 inline-block transition-colors duration-300 hover:text-black"
      >
        {label}
      </span>
      <motion.span
        className="absolute bottom-1 left-0 h-[2px] w-full bg-black origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </motion.a>
  );
};


