"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ChevronRight } from "lucide-react";

interface IssuingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IssuingFormModal = ({ isOpen, onClose }: IssuingFormModalProps) => {
  const [step, setStep] = useState<1 | 2 | "success">(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    website: "",
    assetType: "",
    country: "",
    city: "",
    targetRaise: "",
    details: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('https://maxtronize-api.maxtron.ai/api/lead/init', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          website: formData.website,
        }),
      });

      const data = await response.json();
      if (data.success && data.leadId) {
        setLeadId(data.leadId);
        setStep(2);
      } else {
        console.error("Failed to initialize lead:", data);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error initializing lead:", error);
      alert("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId) return;

    setIsLoading(true);
    try {
   
      const targetRaiseAmount = parseInt(formData.targetRaise.replace(/[^0-9]/g, "")) || 0;

      
      const assetTypeMap: Record<string, string> = {
        "Real Estate": "REAL_ESTATE",
        "Commodity (Gold, etc.)": "COMMODITY",
        "Data Center": "DATA_CENTER",
        "Infrastructure": "INFRASTRUCTURE",
        "Art & Collectibles": "ART_COLLECTIBLES",
        "Other": "OTHER"
      };

      const response = await fetch('https://maxtronize-api.maxtron.ai/api/lead/requirement', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId: leadId,
          assetType: assetTypeMap[formData.assetType] || formData.assetType.toUpperCase().replace(/\s+/g, '_'),
          country: formData.country,
          city: formData.city,
          targetRaiseAmount: targetRaiseAmount,
          additionalDetails: formData.details,
        }),
      });

      if (response.ok) {
        setStep("success");
      } else {
        const errorData = await response.json();
        console.error("Failed to submit requirements:", errorData);
        alert("Failed to submit requirements. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting requirements:", error);
      alert("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAttempt = () => {
    if (step === 2 && !showSkipConfirmation) {
      setShowSkipConfirmation(true);
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setStep(1);
    setLeadId(null);
    setIsLoading(false);
    setShowSkipConfirmation(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      website: "",
      assetType: "",
      country: "",
      city: "",
      targetRaise: "",
      details: "",
    });
    onClose();
  };

  const assetTypes = [
    "Real Estate",
    "Commodity (Gold, etc.)",
    "Data Center",
    "Infrastructure",
    "Art & Collectibles",
    "Other",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
         
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAttempt}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

         
          <div className="fixed inset-0 z-[101] overflow-y-auto overflow-x-hidden flex items-start justify-center p-4 pointer-events-none sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl my-auto bg-[var(--background)] border border-[var(--dashboard-border)] rounded-3xl shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              
              <button
                onClick={handleCloseAttempt}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--field-surface)] transition-colors z-10"
              >
                <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </button>

              <div className="p-6 sm:p-10 md:p-12">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-8">
                        <span className="text-[var(--primary)] text-[10px] font-bold tracking-wider uppercase mb-2 block">
                          Step 01 / 02
                        </span>
                        <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Contact Information</h2>
                        <p className="text-[var(--color-text-secondary)] mt-2">Tell us who you are and how to reach you.</p>
                      </div>

                      <form onSubmit={handleNext} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              required
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="John Smith"
                              className="w-full px-4 py-3 bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl focus:border-[var(--primary)] focus:outline-none text-[var(--color-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                              Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                              required
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com"
                              className="w-full px-4 py-3 bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl focus:border-[var(--primary)] focus:outline-none text-[var(--color-text-primary)]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Phone Number</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+1 (555) 000-0000"
                              className="w-full px-4 py-3 bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl focus:border-[var(--primary)] focus:outline-none text-[var(--color-text-primary)]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Role / Title</label>
                            <input
                              name="role"
                              value={formData.role}
                              onChange={handleInputChange}
                              placeholder="Managing Director"
                              className="w-full px-4 py-3 bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl focus:border-[var(--primary)] focus:outline-none text-[var(--color-text-primary)]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Company Website</label>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="https://company.com"
                            className="w-full px-4 py-3 bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl focus:border-[var(--primary)] focus:outline-none text-[var(--color-text-primary)]"
                          />
                        </div>

                        <div className="pt-6">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all transition-transform active:scale-[0.98] shadow-lg shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? "Initializing..." : "Submit And Next"}
                            {!isLoading && <ChevronRight className="w-4 h-4" />}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {showSkipConfirmation ? (
                        <div className="text-center py-4">
                          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Are you sure you want to skip?</h2>
                          <p className="text-[var(--color-text-secondary)] text-lg mb-10 max-w-sm mx-auto">
                            You've completed the contact info. Skipping Step 2 means we won't have details about your asset yet.
                          </p>
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() => setShowSkipConfirmation(false)}
                              className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-purple-500/10"
                            >
                              Continue to Step 2
                            </button>
                            <button
                              onClick={resetForm}
                              className="w-full py-4 bg-[var(--card-surface)] text-[var(--color-text-primary)] border border-[var(--dashboard-border)] rounded-xl font-bold hover:bg-[var(--field-surface)] transition-all"
                            >
                              Yes, Skip and Close
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mb-8">
                            <button 
                              onClick={() => setStep(1)}
                              className="text-[var(--primary)] text-[10px] font-bold tracking-wider uppercase mb-2 flex items-center gap-1 hover:underline"
                            >
                              <ChevronRight className="w-3 h-3 rotate-180" />
                              Back to Step 01
                            </button>
                            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Asset Requirements</h2>
                            <p className="text-[var(--color-text-secondary)] mt-2">Tell us about the asset you want to tokenize.</p>
                          </div>

                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Asset Type</label>
                              <select
                                name="assetType"
                                value={formData.assetType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl focus:border-[var(--primary)] focus:outline-none text-[var(--color-text-primary)] appearance-none cursor-pointer"
                              >
                                <option value="">Select Asset Type</option>
                                {assetTypes.map((type) => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Country</label>
                                <input
                                  name="country"
                                  value={formData.country}
                                  onChange={handleInputChange}
                                  placeholder="United States"
                                  className="w-full px-4 py-3 bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl focus:border-[var(--primary)] focus:outline-none text-[var(--color-text-primary)]"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">City</label>
                                <input
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  placeholder="New York"
                                  className="w-full px-4 py-3 bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl focus:border-[var(--primary)] focus:outline-none text-[var(--color-text-primary)]"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Target Raise Amount (USD)</label>
                              <input
                                type="text"
                                name="targetRaise"
                                value={formData.targetRaise}
                                onChange={handleInputChange}
                                placeholder="$10,000,000"
                                className="w-full px-4 py-3 bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl focus:border-[var(--primary)] focus:outline-none text-[var(--color-text-primary)]"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Additional Details</label>
                              <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                placeholder="Tell us more about the project, timelines, or specific requirements..."
                                rows={3}
                                className="w-full px-4 py-3 bg-[var(--field-surface)] border border-[var(--dashboard-border)] rounded-xl focus:border-[var(--primary)] focus:outline-none text-[var(--color-text-primary)] resize-none"
                              />
                            </div>

                            <div className="pt-6">
                              <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all transition-transform active:scale-[0.98] shadow-lg shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isLoading ? "Submitting..." : "Submit"}
                                {!isLoading && <CheckCircle className="w-4 h-4" />}
                              </button>
                            </div>
                          </form>
                        </>
                      )}
                    </motion.div>
                  )}

                  {step === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-[var(--sidebar-active-bg)] rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="w-10 h-10 text-[var(--primary)]" />
                      </div>
                      <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">Submission Received</h2>
                      <p className="text-[var(--color-text-secondary)] text-lg mb-10 max-w-sm mx-auto">
                        Our compliance team will review your application and get back to you within 24-48 hours.
                      </p>
                      <button
                        onClick={resetForm}
                        className="px-10 py-4 bg-[var(--card-surface)] text-[var(--color-text-primary)] border border-[var(--dashboard-border)] rounded-xl font-bold hover:bg-[var(--field-surface)] transition-all"
                      >
                        Close
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default IssuingFormModal;
