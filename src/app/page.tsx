'use client';

import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'issuer' | 'investor'>('issuer');

  return (
    <AuthLayout isSignUp={isSignUp} onToggle={setIsSignUp}>
      <div className="space-y-8">
      
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] mb-4">I am a</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setRole('issuer')}
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-[20px] transition-all ${role === 'issuer' ? 'border-primary bg-card text-primary' : 'border-border bg-surface text-text-muted hover:text-foreground hover:border-ui-border-strong'}`}
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
              className={`flex flex-col items-center justify-center p-6 border-2 rounded-[20px] transition-all ${role === 'investor' ? 'border-primary bg-card text-primary' : 'border-border bg-surface text-text-muted hover:text-foreground hover:border-ui-border-strong'}`}
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
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em]">First Name</label>
                <input 
                  type="text" 
                  placeholder="Alex" 
                  className="w-full px-5 py-4 bg-surface border-transparent rounded-xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-text-muted/50 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em]">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Chen" 
                  className="w-full px-5 py-4 bg-surface border-transparent rounded-xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-text-muted/50 text-foreground"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em]">Work Email</label>
            <input 
              type="email" 
              placeholder={isSignUp ? "you@yourfirm.com" : "alex@maxtronize.com"}
              className="w-full px-5 py-4 bg-surface border-transparent rounded-xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm placeholder:text-text-muted/50 text-foreground"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em]">Password</label>
              {!isSignUp && <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot password?</button>}
            </div>
            <div className="relative">
              <input 
                type="password" 
                placeholder={isSignUp ? "Create a strong password" : ""}
                defaultValue={!isSignUp ? "••••••••••" : ""}
                className="w-full px-5 py-4 bg-surface border-transparent rounded-xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-foreground"
              />
              {!isSignUp && (
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {!isSignUp && (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-5 h-5 bg-primary rounded-md shadow-sm">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-text-muted font-medium">Remember me for 30 days</span>
            </div>
          )}

          <button 
            type="button"
            onClick={() => {
              window.location.href = role === 'investor' ? '/investor/hub' : '/issuer/dashboard';
            }}
            className="w-full py-4 bg-primary text-white font-bold rounded-[16px] transition-all flex items-center justify-center gap-2 text-sm group hover:bg-primary-dark"
          >
            {isSignUp ? 'Create Account' : 'Sign In to Platform'}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
          <span className="relative px-4 bg-background text-[10px] font-bold text-text-muted uppercase tracking-widest">or continue with</span>
        </div>

        {/* Wallet Connect */}
        <button className="w-full py-4 border border-border rounded-xl font-bold text-foreground hover:bg-surface transition-all flex items-center justify-center gap-3 text-sm">
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <path d="M12 11V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4"/>
          </svg>
          Connect Wallet (MetaMask / WalletConnect)
        </button>

        {/* Navigation Link */}
        <div className="text-center pt-2">
          <p className="text-sm font-medium text-text-muted">
            {isSignUp ? (
              <>Already have an account? <button onClick={() => setIsSignUp(false)} className="text-primary font-bold hover:underline">Sign in</button></>
            ) : (
              <>Don't have an account? <button onClick={() => setIsSignUp(true)} className="text-primary font-bold hover:underline">Apply for institutional access →</button></>
            )}
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
