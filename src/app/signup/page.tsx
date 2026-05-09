'use client';

import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<'issuer' | 'investor'>('issuer');

  return (
    <AuthLayout isSignUp={true} onToggle={() => router.push('/signin')}>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] mb-4">I am a</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setRole('issuer')}
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all ${role === 'issuer' ? 'border-primary bg-ui-accent-tint text-primary' : 'border-border bg-ui-muted-deep text-text-muted hover:border-ui-border-strong'}`}
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
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all ${role === 'investor' ? 'border-primary bg-ui-accent-tint text-primary' : 'border-border bg-ui-muted-deep text-text-muted hover:border-ui-border-strong'}`}
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
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em]">First Name</label>
              <input 
                type="text" 
                placeholder="Alex" 
                className="w-full px-5 py-4 bg-ui-input border border-ui-border rounded-xl focus:bg-ui-input-focus focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-foreground placeholder:text-ui-placeholder"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em]">Last Name</label>
              <input 
                type="text" 
                placeholder="Chen" 
                className="w-full px-5 py-4 bg-ui-input border border-ui-border rounded-xl focus:bg-ui-input-focus focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-foreground placeholder:text-ui-placeholder"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em]">Work Email</label>
            <input 
              type="email" 
              placeholder="you@yourfirm.com" 
              className="w-full px-5 py-4 bg-ui-input border border-ui-border rounded-xl focus:bg-ui-input-focus focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-foreground placeholder:text-ui-placeholder"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em]">Password</label>
            <input 
              type="password" 
              placeholder="Create a strong password" 
              className="w-full px-5 py-4 bg-ui-input border border-ui-border rounded-xl focus:bg-ui-input-focus focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-foreground"
            />
          </div>

          <button 
            type="button"
            onClick={() => router.push('/issuer/onboarding')}
            className="btn-gradient-primary w-full py-4 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 text-sm group"
          >
            Create Account
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
          <span className="relative px-4 bg-background text-[10px] font-bold text-ui-faint uppercase tracking-widest">or continue with</span>
        </div>

        {/* Wallet Connect */}
        <button className="w-full py-4 border border-border rounded-xl font-bold text-foreground bg-btn-secondary-bg hover:bg-btn-secondary-hover transition-all flex items-center justify-center gap-3 text-sm">
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <path d="M12 11V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4"/>
          </svg>
          Connect Wallet (MetaMask / WalletConnect)
        </button>

        {/* Navigation Link */}
        <div className="text-center pt-2">
          <p className="text-sm font-medium text-text-muted">
            Already have an account? <button onClick={() => router.push('/signin')} className="text-primary font-bold hover:underline">Sign in</button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
