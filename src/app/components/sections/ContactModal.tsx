"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    
    try {
      const response = await fetch('https://maxtron-asset-landing-form-backend.onrender.com/api/v1/early-access', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit. Please try again.');
      }

      const data = await response.json();
      console.log("Success:", data);
      
      setSubmitStatus("success");
      setEmail("");
      
      
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

        
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
             
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-700" />
              </motion.button>

              <div className="grid md:grid-cols-2 min-h-[500px]">
                {/* Left Content */}
                <div className="p-8 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center relative">
                  <AnimatePresence mode="wait">
                    {submitStatus === "success" ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-start justify-center h-full w-full"
                      >
                         <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                          className="mb-6 rounded-full bg-green-100 p-4"
                        >
                          <CheckCircle className="w-16 h-16 text-green-600" />
                        </motion.div>
                        
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#000] mb-4 leading-tight font-sf-pro">
                          Congratulations!
                        </h2>
                        <p className="text-[#000] text-lg mb-8 leading-relaxed opacity-80">
                          You&apos;ve successfully joined our early access list. We&apos;ll be in touch soon with exclusive updates.
                        </p>
                        
                        <motion.button
                          onClick={onClose}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative px-10 py-3 bg-[#482388] hover:bg-[#4a38b4] text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl overflow-hidden"
                        >
                          <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
                            initial={{ x: "0%" }}
                            animate={{ x: "0%" }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="relative z-10">Close</span>
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#000] mb-4 leading-tight font-sf-pro">
                          Get Early Access
                          <br />
                          To Our Platform
                        </h2>
                        
                        <p className="text-[#000] text-base sm:text-lg mb-8 leading-relaxed">
                          Tokenize real-world assets with institutional-grade security and seamless on-chain settlement
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email"
                              required
                              className="w-full px-6 py-4 border-2 border-[#4E449A] rounded-lg focus:border-[#4E449A] focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                            />
                          </motion.div>

                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative w-auto px-10 py-4 bg-[#482388] hover:bg-[#4a38b4] text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                          >
                            <motion.span
                              className="absolute inset-0 bg-gradient-to-r from-[#4E449A] to-[#6B5DD3]"
                              initial={{ x: "0%" }}
                              animate={{ x: "0%" }}
                              transition={{ duration: 0.3 }}
                            />
                            <span className="relative z-10">
                              {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Submitting...
                                </span>
                              ) : (
                                "SUBMIT"
                              )}
                            </span>
                          </motion.button>
                          
                          <AnimatePresence>
                            {submitStatus === "error" && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg w-full"
                              >
                                <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <p className="text-red-700 font-medium text-sm">
                                  {errorMessage}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

               
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative hidden md:block"
                >
                  <Image
                    src="/images/contact.webp"
                    alt="Tokenization Platform"
                    fill
                    className="object-cover"
                    priority
                  />
                  
                 
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/20" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
