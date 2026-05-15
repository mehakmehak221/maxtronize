'use client';

import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<'issuer' | 'investor'>('issuer');
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <AuthLayout isSignUp={true} onToggle={() => router.push('/signin')}>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        <div>
          <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.1em] mb-4">I am a</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setRole('issuer')}
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all ${role === 'issuer' ? 'border-[#C084FC] bg-[#faf5ff] text-[#7C3AED]' : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] hover:border-[#D1D5DB]'}`}
            >
              <div className="w-8 h-8 mb-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
                  <path d="M9 20v-8h6v8"/>
                  <path d="M9 4v4h6V4"/>
                </svg>
              </div>
              <span className="text-xs font-bold">Asset Issuer</span>
            </button>
            <button 
              onClick={() => setRole('investor')}
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all ${role === 'investor' ? 'border-[#C084FC] bg-[#faf5ff] text-[#7C3AED]' : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] hover:border-[#D1D5DB]'}`}
            >
              <div className="w-8 h-8 mb-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span className="text-xs font-bold">Investor</span>
            </button>
          </div>
        </div>

        {/* Form Section */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">First Name</label>
              <input 
                type="text" 
                placeholder="Alex" 
                className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:border-[#C084FC] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">Last Name</label>
              <input 
                type="text" 
                placeholder="Chen" 
                className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:border-[#C084FC] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">Work Email</label>
            <input 
              type="email" 
              placeholder="you@yourfirm.com" 
              className="w-full px-5 py-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:border-[#C084FC] focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">Password</label>
            <div className="relative">
              <input 
                type={passwordVisible ? "text" : "password"}
                placeholder="Create a strong password"
                autoComplete="new-password"
                className="w-full px-5 py-4 pr-12 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-all focus:bg-white focus:border-[#C084FC] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((v) => !v)}
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563]"
              >
                {passwordVisible ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => {
              signIn({ role });
              router.push(role === 'investor' ? '/investor/overview' : '/issuer/onboarding');
            }}
            className="btn-gradient-primary w-full py-4 text-white font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/25 hover:shadow-xl hover:shadow-[#6366F1]/30 transition-all flex items-center justify-center gap-2 text-sm group"
          >
            Create Account
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E7EB]"></div></div>
          <span className="relative bg-white px-4 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">or continue with</span>
        </div>

        {/* Wallet Connect */}
        <button className="w-full py-4 rounded-xl border border-[#E5E7EB] bg-white text-sm font-bold text-[#1F2937] transition-all hover:bg-[#F9FAFB] flex items-center justify-center gap-3">
          <svg className="h-5 w-5 text-[#9CA3AF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <path d="M12 11V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4"/>
          </svg>
          Connect Wallet (MetaMask / WalletConnect)
        </button>

        {/* Navigation Link */}
        <div className="text-center pt-2">
          <p className="text-sm font-medium text-[#9CA3AF]">
            Already have an account? <button onClick={() => router.push('/signin')} className="font-bold text-[#7C3AED] hover:underline">Sign in</button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
