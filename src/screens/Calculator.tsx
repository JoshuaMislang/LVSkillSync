import { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { ArrowLeft, Calculator as CalcIcon, Sparkles, CheckCircle2, ShieldCheck, TrendingUp, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { jobs as allJobs } from '../data';

export default function Calculator() {
  const { goBack, selectedJob, setSelectedJob } = useAppContext();
  
  // Extract clean numeric value from budget string like "₱15,000" -> "15000"
  const extractNumericBudget = (budgetStr?: string) => {
    if (!budgetStr) return '5000';
    const clean = budgetStr.replace(/[^0-9]/g, '');
    return clean || '5000';
  };

  const [amount, setAmount] = useState<string>(() => {
    return selectedJob ? extractNumericBudget(selectedJob.budget) : '5000';
  });

  const [hours, setHours] = useState<string>('15');

  // Automatically sync calculation when selectedJob changes or when viewing a gig
  useEffect(() => {
    if (selectedJob?.budget) {
      const parsed = extractNumericBudget(selectedJob.budget);
      setAmount(parsed);
    }
  }, [selectedJob]);

  const numericAmount = Math.max(0, parseFloat(amount) || 0);
  const numericHours = Math.max(1, parseFloat(hours) || 1);

  // LVSkillSync: 0% fee (100% free for students)
  const lvCommission = 0;
  const lvEarnings = numericAmount;
  const hourlyRate = (numericAmount / numericHours).toFixed(0);

  // Commercial platforms comparison (e.g., Upwork/Fiverr 15%-20%)
  const standardFeeRate = 0.15;
  const commercialCommission = numericAmount * standardFeeRate;
  const commercialEarnings = numericAmount - commercialCommission;

  const presets = ['1500', '3500', '5000', '10000', '25000'];

  return (
    <motion.div 
      id="calculator-screen"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-white"
    >
      {/* Top Header */}
      <div className="w-full bg-slate-50/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              id="calc-back-btn"
              onClick={() => goBack()}
              className="w-10 h-10 rounded-xl bg-white dark:bg-[#111E38] shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
            </button>
            <div>
              <h1 className="font-heading font-extrabold text-base sm:text-lg text-[#0B192C] dark:text-white leading-tight">
                Earnings Calculator
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Calculate your take-home pay with 0% platform fees
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 pb-28 sm:pb-20">
        {/* Active Chosen Gig Alert / Banner */}
        {selectedJob ? (
          <div className="p-4 bg-blue-50/90 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {selectedJob.company}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-sm text-[#0B192C] dark:text-white truncate">
                  {selectedJob.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Budget: <strong className="text-emerald-600 dark:text-emerald-400">{selectedJob.budget}</strong> • Deadline: {selectedJob.deadline}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                ₱{numericAmount.toLocaleString()} Payout
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>Select a gig below or enter a custom amount.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): Input Parameters */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111E38] rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-5">
            {/* Quick Gig Selector Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Choose Opportunity to Calculate
              </label>
              <select
                value={selectedJob ? selectedJob.id : 'custom'}
                onChange={(e) => {
                  const targetId = e.target.value;
                  if (targetId === 'custom') {
                    setSelectedJob(null);
                  } else {
                    const found = allJobs.find(j => j.id === targetId);
                    if (found) {
                      setSelectedJob(found);
                      setAmount(extractNumericBudget(found.budget));
                    }
                  }
                }}
                className="w-full bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="custom">-- Custom Amount / Independent Gig --</option>
                {allJobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} • {j.budget} ({j.clientName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Project Stipend (PHP)
              </label>
              <div className="relative mb-3">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-blue-600 font-extrabold text-xl">
                  ₱
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-xl text-2xl font-heading font-extrabold text-[#0B192C] dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="0"
                />
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      amount === preset
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    ₱{Number(preset).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Hours Slider/Input */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Estimated Working Hours
                </label>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {hours} hours total
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="80"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 hour (Quick Gig)</span>
                <span>40 hours (Standard)</span>
                <span>80 hours (Capstone)</span>
              </div>
            </div>

            {/* 100% Free Student Platform Guarantee Banner */}
            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
                  0% Fee Policy
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  You keep 100% of your earnings with zero platform deductions.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Real-Time Calculation & Comparison */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#111E38] rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h2 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Take-Home Summary
              </h2>

              {/* Big Net Payout */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
                  Your Net Take-Home
                </span>
                <p className="font-heading font-extrabold text-3xl text-emerald-600 dark:text-emerald-400">
                  ₱{lvEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1 inline-block">
                  Direct student payout (0% fee)
                </span>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Gross Client Amount:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    ₱{numericAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Platform Commission:</span>
                  <span className="font-bold text-emerald-600">₱0.00 (100% Free)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Effective Hourly Wage:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">₱{hourlyRate}/hr</span>
                </div>
              </div>

              {/* Comparison Callout */}
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-900/50 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Student Advantage</span>
                </div>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                  Other platforms deduct 15–20% in fees. With LVSkillSync, you save <strong className="text-blue-900 dark:text-white">₱{commercialCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.
                </p>
              </div>
            </div>

            {/* Escrow Guarantee */}
            <div className="bg-white dark:bg-[#111E38] rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                  Milestone Escrow Protection
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Clients fund projects before work begins and payments are released on signoff.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
