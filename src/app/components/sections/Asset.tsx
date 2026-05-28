"use client";

import { motion, Variants, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const assets = [
  {
    title: "Gold and Gold Mines",
    description:
      "Physical gold, refinery-backed reserves, and operating gold mining assets.",
    image: "/images/content.webp",
  },
  {
    title: "Real Estate",
    description:
      "Skyscrapers, commercial properties, residential developments, rental assets, and land holdings.",
    image: "/images/real-estate.webp",
  },
  {
    title: "Stocks",
    description:
      "Publicly listed equities and structured market-linked instruments.",
    image: "/images/stocks.webp",
  },
  {
    title: "Bonds",
    description:
      "Corporate bonds, government securities, and fixed-income debt instruments.",
    image: "/images/bonds.webp",
  },
  {
    title: "Commodities",
    description:
      "Access real-world assets such as metals, energy, and raw materials.",
    image: "/commodities.webp",
  },
  {
    title: "Curated Crypto",
    description:
      "Digital assets backed by research, offering high-conviction exposure to the future of finance.",
    image: "/crypto.webp",
  },
  {
    title: "Exclusive High Yield",
    description:
      "Unlock premium yield strategies not typically accessible through traditional investment channels.",
    image: "/yield.webp",
  },
];

function NavBtn({
  onClick,
  children,
  label,
}: {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CCCCCC] bg-white text-[#333333] transition-all duration-200 hover:border-[#6653AF] hover:bg-[#6653AF] hover:text-white"
    >
      {children}
    </button>
  );
}

function AssetCard({ asset }: { asset: (typeof assets)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative aspect-[3/4] w-full flex-shrink-0 cursor-pointer overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <motion.img
        src={asset.image}
        alt={asset.title}
        className="h-full w-full object-cover"
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: hovered ? "100%" : "-100%" }}
        transition={{ duration: 0.8 }}
      />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <motion.h3
          className="mb-1.5 text-[15px] lg:text-[20px] font-bold uppercase tracking-wider text-white"
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {asset.title}
        </motion.h3>
        <motion.p
          className="text-[12px] leading-relaxed text-white/85"
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.3, delay: 0.04 }}
        >
          {asset.description}
        </motion.p>

        <motion.div
          className="mt-2.5 h-[2px] rounded-full bg-gradient-to-r from-[#6653AF] to-[#9B8CE8]"
          initial={{ width: 0 }}
          animate={{ width: hovered ? "40%" : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}

export default function Asset() {
  const [virtualIndex, setVirtualIndex] = useState(assets.length);
  const [isAnimating, setIsAnimating] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setItemsPerView(1);
      else if (w < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const norm = (v: number) =>
    ((v % assets.length) + assets.length) % assets.length;
  const currentIndex = norm(virtualIndex);
  const repeated = [...assets, ...assets, ...assets];

  const prev = () => setVirtualIndex((p) => p - 1);
  const next = () => setVirtualIndex((p) => p + 1);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const d = touchStart - touchEnd;
    if (d > 50) next();
    if (d < -50) prev();
  };

  useEffect(() => {
    const t = setInterval(() => setVirtualIndex((p) => p + 1), 4000);
    return () => clearInterval(t);
  }, []);

  const onComplete = () => {
    const min = assets.length;
    const max = assets.length * 2 - 1;
    if (virtualIndex < min || virtualIndex > max) {
      setIsAnimating(false);
      setVirtualIndex(assets.length + norm(virtualIndex));
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsAnimating(true)),
      );
    }
  };

  const btnRef = useRef<HTMLAnchorElement>(null);
  const bX = useMotionValue(0);
  const bY = useMotionValue(0);
  const bSpX = useSpring(bX, { damping: 20, stiffness: 300 });
  const bSpY = useSpring(bY, { damping: 20, stiffness: 300 });
  const [btnHovered, setBtnHovered] = useState(false);

  const onBtnMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    bX.set((e.clientX - (r.left + r.width / 2)) * 0.15);
    bY.set((e.clientY - (r.top + r.height / 2)) * 0.15);
  };
  const onBtnLeave = () => {
    bX.set(0);
    bY.set(0);
    setBtnHovered(false);
  };

  return (
    <section id="assets" className="relative overflow-hidden bg-white ">
      <div className="mx-auto max-w-[96rem] px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-20 lg:py-28">
        <div className="mb-8 flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[22px] font-semibold text-[#111111] sm:text-[28px] md:text-[32px]"
          >
            Innovating Across Asset Types
          </motion.h2>

          {/* Arrows */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2"
          >
            <NavBtn onClick={prev} label="Previous">
              <ChevronLeft className="h-4 w-4" />
            </NavBtn>
            <NavBtn onClick={next} label="Next">
              <ChevronRight className="h-4 w-4" />
            </NavBtn>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div
            className="overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <motion.div
              className="flex gap-3 sm:gap-4"
              animate={{ x: `-${(virtualIndex * 100) / itemsPerView}%` }}
              transition={
                isAnimating
                  ? { type: "spring", stiffness: 320, damping: 34 }
                  : { duration: 0 }
              }
              onAnimationComplete={onComplete}
            >
              {repeated.map((asset, i) => (
                <div
                  key={`${asset.title}-${i}`}
                  className="w-full flex-shrink-0"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <AssetCard asset={asset} />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-5 flex justify-center gap-1.5">
            {assets.map((_, i) => (
              <button
                key={i}
                onClick={() => setVirtualIndex(assets.length + norm(i))}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-6 bg-[#6653AF]" : "w-1.5 bg-[#CCCCCC]"
                }`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8"
        >
          <motion.a
            ref={btnRef}
            href="https://beta.maxtronize.com/signin"
            onMouseMove={onBtnMove}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={onBtnLeave}
            style={{ x: bSpX, y: bSpY }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-fit group relative inline-flex items-center gap-3 overflow-hidden rounded-md bg-[#1A1A1A] pl-5 pr-4 py-2.5 text-[14px] font-medium text-white shadow-md hover:shadow-lg"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
              initial={{ x: "0%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Explore Assets</span>
            <span className="relative z-10 flex items-center justify-center transition-transform group-hover:translate-x-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 5C16 5.742 16.733 6.85 17.475 7.78C18.429 8.98 19.569 10.027 20.876 10.826C21.856 11.425 23.044 12 24 12M24 12C23.044 12 21.855 12.575 20.876 13.174C19.569 13.974 18.429 15.021 17.475 16.219C16.733 17.15 16 18.26 16 19M24 12H0"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
