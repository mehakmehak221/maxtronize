'use client';

import React, { useState, useMemo } from 'react';
import { Shield, Sparkles, Award, Lock, ChevronRight, Zap, TrendingUp } from 'lucide-react';

interface Tier {
  name: string;
  min: number;
  max: number;
  partMult: number;
  govMult: number;
  discount: number;
  perks: string;
  color: string;
  glow: string;
}

interface LockOption {
  name: string;
  days: number;
  partMult: number;
  govMult: number;
}

const TIER_COLORS: Record<string, { color: string; glow: string; gradient: string }> = {
  Bronze: { color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', gradient: 'from-amber-600 to-amber-500' },
  Silver: { color: '#94a3b8', glow: 'rgba(148,163,184,0.3)', gradient: 'from-slate-400 to-slate-300' },
  Gold:   { color: '#eab308', glow: 'rgba(234,179,8,0.4)',  gradient: 'from-yellow-500 to-yellow-400' },
  Platinum: { color: '#6b58ca', glow: 'rgba(168,85,247,0.5)', gradient: 'from-[#5D49C1] to-[#6b58ca]' },
};

export default function TokenomicsCalculator() {
  const [stakeAmount, setStakeAmount] = useState<number>(25000);
  const [lockIndex, setLockIndex] = useState<number>(2);

  const tiers: Tier[] = useMemo(() => [
    { name: 'Bronze',   min: 1000,   max: 9999,    partMult: 1.0, govMult: 1.0, discount: 5,  perks: 'Standard Access',              color: TIER_COLORS.Bronze.color,   glow: TIER_COLORS.Bronze.glow },
    { name: 'Silver',   min: 10000,  max: 49999,   partMult: 1.25, govMult: 1.5, discount: 10, perks: 'Priority Access',              color: TIER_COLORS.Silver.color,   glow: TIER_COLORS.Silver.glow },
    { name: 'Gold',     min: 50000,  max: 199999,  partMult: 1.5,  govMult: 2.0, discount: 20, perks: 'Fast-Track + Allocation Priority', color: TIER_COLORS.Gold.color,  glow: TIER_COLORS.Gold.glow },
    { name: 'Platinum', min: 200000, max: Infinity, partMult: 2.0,  govMult: 3.0, discount: 30, perks: 'Dedicated + Maximum Allocation', color: TIER_COLORS.Platinum.color, glow: TIER_COLORS.Platinum.glow },
  ], []);

  const lockOptions: LockOption[] = useMemo(() => [
    { name: 'Flexible',   days: 0,   partMult: 1.0,  govMult: 1.0 },
    { name: '30-Day',     days: 30,  partMult: 1.15, govMult: 1.15 },
    { name: '90-Day',     days: 90,  partMult: 1.35, govMult: 1.5 },
    { name: '180-Day',    days: 180, partMult: 1.75, govMult: 2.0 },
    { name: '365-Day',    days: 365, partMult: 2.5,  govMult: 3.0 },
  ], []);

  const currentTier = useMemo(() => {
    if (stakeAmount < 1000) return null;
    return tiers.find((t) => stakeAmount >= t.min && stakeAmount <= t.max) ?? tiers[tiers.length - 1];
  }, [stakeAmount, tiers]);

  const nextTier = useMemo(() => {
    if (stakeAmount < 1000) return tiers[0];
    const idx = tiers.findIndex((t) => stakeAmount >= t.min && stakeAmount <= t.max);
    return idx !== -1 && idx < tiers.length - 1 ? tiers[idx + 1] : null;
  }, [stakeAmount, tiers]);

  const progressToNext = useMemo(() => {
    if (!nextTier) return 100;
    if (stakeAmount < 1000) return (stakeAmount / 1000) * 100;
    const base = currentTier ? currentTier.min : 0;
    return Math.min(Math.max(((stakeAmount - base) / (nextTier.min - base)) * 100, 0), 100);
  }, [stakeAmount, currentTier, nextTier]);

  const selectedLock = lockOptions[lockIndex];

  const stats = useMemo(() => {
    if (stakeAmount < 1000) return { partMult: 0, govMult: 0, partPower: 0, govPower: 0, discount: 0, perks: 'Minimum 1,000 MAXTRON required' };
    const pm = Math.min((currentTier?.partMult ?? 1) * selectedLock.partMult, 5.0);
    const gm = (currentTier?.govMult ?? 1) * selectedLock.govMult;
    return { partMult: pm, govMult: gm, partPower: Math.round(stakeAmount * pm), govPower: Math.round(stakeAmount * gm), discount: currentTier?.discount ?? 0, perks: currentTier?.perks ?? 'No Perks' };
  }, [stakeAmount, currentTier, selectedLock]);

  const presets = [5000, 25000, 75000, 250000];

  return (
    <div
      className="w-full rounded-3xl border border-[#5D49C1]/15 overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, rgba(13,10,36,0.95) 0%, rgba(8,5,25,0.98) 100%)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 1px 0 rgba(168,85,247,0.1) inset',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#6b58ca]/50 to-transparent" />

      {/* Header */}
      <div
        className="px-8 py-6 border-b border-[#5D49C1]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: 'rgba(93,73,193,0.04)' }}
      >
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5D49C1] to-[#6344C6]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Interactive Utility Calculator
          </h3>
          <p className="text-xs text-[#64748b] mt-1 ml-10">
            Simulate staked quantities and lock durations to evaluate multipliers.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#5D49C1]/10 border border-[#5D49C1]/20 text-[#9488dc] text-xs font-bold px-3.5 py-1.5 rounded-full w-fit">
          <Award className="w-3.5 h-3.5 text-[#6b58ca]" />
          Max Combined: 5.0×
        </div>
      </div>

      {/* Body grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">

        {/* LEFT: Inputs */}
        <div className="lg:col-span-7 space-y-8">

          {/* Stake amount */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-black text-[#64748b] uppercase tracking-wider">
                Staking Amount (MAXTRON)
              </label>
              <div
                className="text-base font-black px-3 py-1 rounded-lg"
                style={{ color: currentTier?.color ?? '#6b58ca', background: `${currentTier?.color ?? '#6b58ca'}15` }}
              >
                {stakeAmount.toLocaleString()} MAXTRON
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="500000"
              step="1000"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              className="slider-dark"
            />

            {/* Presets */}
            <div className="grid grid-cols-4 gap-2.5 mt-4">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setStakeAmount(p)}
                  className={`py-2.5 px-2 text-xs font-bold rounded-xl border transition-all duration-300 ${
                    stakeAmount === p
                      ? 'bg-gradient-to-r from-[#5D49C1] to-[#6344C6] border-transparent text-white shadow-[0_0_16px_rgba(93,73,193,0.4)]'
                      : 'bg-white/3 border-[#5D49C1]/15 text-[#64748b] hover:border-[#5D49C1]/30 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p >= 100000 ? `${p / 1000}k` : p.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Lock duration */}
          <div>
            <label className="block text-xs font-black text-[#64748b] uppercase tracking-wider mb-3">
              Lock Duration Commitment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {lockOptions.map((opt, idx) => (
                <button
                  key={opt.name}
                  onClick={() => setLockIndex(idx)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-300 ${
                    lockIndex === idx
                      ? 'bg-[#5D49C1]/15 border-[#5D49C1]/50 shadow-[0_0_16px_rgba(93,73,193,0.2)] scale-[1.04]'
                      : 'bg-white/3 border-[#5D49C1]/10 hover:bg-white/5 hover:border-[#5D49C1]/25'
                  }`}
                >
                  <Lock className={`w-4 h-4 mb-2 ${lockIndex === idx ? 'text-[#6b58ca]' : 'text-[#475569]'}`} />
                  <span className={`text-xs font-bold block ${lockIndex === idx ? 'text-white' : 'text-[#64748b]'}`}>
                    {opt.name}
                  </span>
                  <div className="mt-1.5 space-y-0.5">
                    <span className={`text-[10px] block ${lockIndex === idx ? 'text-[#6b58ca]' : 'text-[#475569]'}`}>
                      Part: {opt.partMult}×
                    </span>
                    <span className={`text-[10px] block ${lockIndex === idx ? 'text-[#9488dc]' : 'text-[#475569]'}`}>
                      Gov: {opt.govMult}×
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tier progress */}
          {stakeAmount > 0 && (
            <div className="rounded-xl border border-[#5D49C1]/15 bg-[#5D49C1]/4 p-5">
              <div className="flex justify-between items-center text-xs mb-3">
                <span className="text-[#94a3b8]">
                  Current Tier: <strong style={{ color: currentTier?.color ?? '#64748b' }}>{currentTier?.name ?? 'None'}</strong>
                </span>
                {nextTier && (
                  <span className="text-[#6b58ca] font-bold flex items-center gap-1">
                    Upgrade to {nextTier.name} at {nextTier.min.toLocaleString()}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressToNext}%`,
                    background: currentTier ? `linear-gradient(90deg, ${currentTier.color}80, ${currentTier.color})` : 'linear-gradient(90deg, #5D49C1, #6344C6)',
                    boxShadow: currentTier ? `0 0 8px ${currentTier.glow}` : undefined,
                  }}
                />
              </div>
              {nextTier && (
                <div className="text-[11px] text-[#64748b] mt-2.5 font-medium">
                  Stake{' '}
                  <span style={{ color: nextTier.color }} className="font-bold">
                    {(nextTier.min - stakeAmount).toLocaleString()}
                  </span>{' '}
                  more to unlock {nextTier.perks} and {nextTier.discount}% fee discounts.
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT: Outputs */}
        <div
          className="lg:col-span-5 rounded-2xl border border-[#5D49C1]/15 p-6 flex flex-col justify-between relative overflow-hidden"
          style={{ background: 'rgba(93,73,193,0.04)', backdropFilter: 'blur(12px)' }}
        >
          {/* Subtle top gradient line */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${currentTier?.color ?? '#6b58ca'}60, transparent)` }}
          />

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#64748b] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#5D49C1]" />
              Ecosystem Benefits
            </h4>

            {/* Tier badge */}
            <div className="flex items-center justify-between border-b border-white/5 pb-5">
              <span className="text-sm font-semibold text-[#64748b]">Staking Tier</span>
              {currentTier ? (
                <div
                  className="px-3.5 py-1.5 rounded-full border text-xs font-black"
                  style={{
                    color: currentTier.color,
                    borderColor: `${currentTier.color}40`,
                    background: `${currentTier.color}12`,
                    boxShadow: `0 0 12px ${currentTier.glow}`,
                  }}
                >
                  ◆ {currentTier.name} Tier
                </div>
              ) : (
                <span className="text-xs font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full uppercase">
                  None (&lt;1k)
                </span>
              )}
            </div>

            {/* Multiplier cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Participation', mult: stats.partMult, power: stats.partPower, color: '#6b58ca', powerLabel: 'Power' },
                { label: 'Governance', mult: stats.govMult, power: stats.govPower, color: '#9488dc', powerLabel: 'Weight' },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-white/5 p-4 relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${m.color} 0%, transparent 70%)` }}
                  />
                  <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider block relative z-10">{m.label}</span>
                  <div className="text-3xl font-black text-white mt-1 relative z-10" style={{ textShadow: `0 0 20px ${m.color}60` }}>
                    {m.mult.toFixed(2)}×
                  </div>
                  <span className="text-[10px] text-[#64748b] block mt-1 relative z-10">
                    {m.powerLabel}: <strong style={{ color: m.color }}>{m.power.toLocaleString()}</strong>
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                <span className="text-[#94a3b8] font-medium">Fee Discount</span>
                <span className="font-black text-emerald-400" style={{ textShadow: '0 0 12px rgba(52,211,153,0.4)' }}>
                  {stats.discount}% Off Fees
                </span>
              </div>
              <div className="flex justify-between items-start text-sm py-2">
                <span className="text-[#94a3b8] font-medium">Staking Perks</span>
                <span className="font-bold text-white text-right max-w-[60%] leading-relaxed text-xs">{stats.perks}</span>
              </div>
            </div>

            {/* Power bar */}
            {stats.partMult > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#64748b]">
                  <span className="font-semibold">Combined Multiplier</span>
                  <span className="font-black text-[#6b58ca]">{((stats.partMult / 5) * 100).toFixed(0)}% of Max</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(stats.partMult / 5) * 100}%`,
                      background: 'linear-gradient(90deg, #5D49C1, #6b58ca)',
                      boxShadow: '0 0 8px rgba(168,85,247,0.5)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-[10px] text-[#475569] leading-relaxed">
              Calculations are estimates. Realized governance weights and parameters are updated dynamically in corresponding escrow smart contracts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
