"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What happens to my asset if Maxtronize ceases operations?",
    answer: "Nothing happens to your asset. The SPV holding legal title is an independent legal entity with its own director and bank accounts. If Maxtronize were to wind down, a successor administrator steps in per pre-agreed terms, and token holders retain their claim on SPV equity. The asset itself is never held by Maxtronize — it is held by the SPV and its qualified custodian."
  },
  {
    question: "Who has custody of the underlying asset?",
    answer: "Physical and financial assets are held by regulated qualified custodians — typically NYDFS-chartered trust companies for financial assets, licensed vaulting partners for commodities, and title-recorded SPVs for real estate. Custodians are disclosed in the offering memorandum before any token is issued."
  },
  {
    question: "How are investors verified? I do not want random buyers.",
    answer: "Every wallet that interacts with your token goes through KYC/AML and, where applicable, accredited investor verification. These checks are enforced at the smart contract level, so an unverified wallet cannot receive the token. You can also request geography-based or investor-type restrictions for the primary offering."
  },
  {
    question: "What is the fee structure?",
    answer: "A one-time structuring fee (typically 0.75%–1.5% of asset value depending on complexity) plus ongoing administration fees (roughly 15–40 bps annually). All fees are disclosed upfront in the term sheet before engagement. No success fees, no carry."
  },
  {
    question: "Do I lose control of the asset?",
    answer: "You control what you tokenize. Many sponsors retain majority ownership and only tokenize a minority slice to raise liquidity. Governance rights (voting, operational decisions) can be retained, delegated, or distributed on your terms. The SPV operating agreement is drafted jointly with you."
  },
  {
    question: "Is this legal in my jurisdiction?",
    answer: "Maxtronize operates under Reg D and Reg S in the U.S., MiCA in the EU, and tailored frameworks in the UAE, Singapore, and Switzerland. During intake, we confirm jurisdictional fit and, if required, restructure the issuance, for example through an offshore SPV, to ensure compliance. We do not onboard assets where legality is unclear."
  }
];

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-[var(--dashboard-border)] last:border-0">
      <button
        onClick={onClick}
        className="w-full py-8 flex justify-between items-center text-left group"
      >
        <span className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--primary)] transition-colors pr-8">
          {question}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-[var(--dashboard-border)] flex items-center justify-center transition-all ${isOpen ? 'bg-[var(--primary)] border-[var(--primary)] text-white rotate-180' : 'text-[var(--color-text-muted)]'}`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-lg text-[var(--color-text-muted)] pb-8 leading-relaxed max-w-4xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AssetRegisterFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[var(--background)] py-24">
      <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[var(--primary)] text-base font-bold tracking-widest uppercase mb-4 block">
                LEARN MORE
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)] mb-8 leading-tight">
                Frequently asked questions.
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                Everything you need to know about tokenizing your assets with Maxtronize.
                If you cannot find the answer you are looking for, reach out to our team.
              </p>
            </motion.div>
          </div>
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-[var(--card-surface)] border border-[var(--dashboard-border)] rounded-[2.5rem] p-8 md:p-12 shadow-sm"
            >
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssetRegisterFAQ;
