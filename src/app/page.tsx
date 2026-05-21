"use client";

import Image from "next/image";
import Hero from "@/app/components/sections/Hero";
import Navbar from "@/app/components/sections/Navbar";
import Tokenization from "@/app/components/sections/Tokenization";
import WhyTokenize from "@/app/components/sections/WhyTokenize";
import Assets from "@/app/components/sections/Assets";
import Intelligence from "@/app/components/sections/Intelligence";
import Platform from "@/app/components/sections/Platform";
import Rwa from "@/app/components/sections/Rwa";
import Asset from "@/app/components/sections/Asset";
import Realasset from "@/app/components/sections/Realasset";
import Focus from "@/app/components/sections/Focus";
import Footer from "@/app/components/sections/Footer";
import WhyTokenizeWithMaxtron from "@/app/components/sections/WhyTokenizeWithMaxtron";
import Leadership from "@/app/components/sections/Leadership";
import Transform from "@/app/components/sections/Transform";
import Global from "@/app/components/sections/Global";
import Tokenize from "@/app/components/sections/Tokenize";
import Bridge from "@/app/components/sections/Bridge";
import Future from "@/app/components/sections/Future";
import AppDownloadSection from "@/app/components/sections/AppDownloadSection";


export default function Home() {
  return (
    <main className="w-full relative min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Tokenization />
      <Future/>
      {/* <WhyTokenize /> */}
      <Assets />
      {/* <Rwa /> */}
      {/* <Platform /> */}
      <Bridge/>
      <Tokenize/>
      <Realasset />
      <Asset />
      {/* <Global /> */}
      {/* <Focus/> */}
      <Intelligence />
      
      {/* <WhyTokenizeWithMaxtron /> */}
       <AppDownloadSection />
      <Leadership />
      <Transform />
     
      <Footer />
    </main>
  );
}
