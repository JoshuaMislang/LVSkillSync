import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../AppContext';
import { Loader2 } from 'lucide-react';
import { BRAND_CONFIG } from '../config/branding';

export default function Splash() {
  const { setCurrentScreen } = useAppContext();
  const [loadingProgress, setLoadingProgress] = useState(20);

  const handleProceed = useCallback(() => {
    setCurrentScreen('Login');
  }, [setCurrentScreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleProceed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleProceed]);

  useEffect(() => {
    const t1 = setTimeout(() => setLoadingProgress(65), 350);
    const t2 = setTimeout(() => setLoadingProgress(90), 800);
    const t3 = setTimeout(() => setLoadingProgress(100), 1200);
    const finishTimer = setTimeout(() => {
      handleProceed();
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(finishTimer);
    };
  }, [handleProceed]);

  return (
    <motion.div
      id="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={handleProceed}
      className="fixed inset-0 w-full h-full bg-slate-50 dark:bg-[#0B192C] text-slate-800 dark:text-white flex flex-col items-center justify-center select-none cursor-pointer"
    >
      {/* Standard Browser Website Top Loading Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-white/5 z-50">
        <motion.div
          className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]"
          initial={{ width: '15%' }}
          animate={{ width: `${loadingProgress}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      {/* Main Centered Content - Clean & Plain Standard Website Opening */}
      <div className="flex flex-col items-center text-center px-4 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center justify-center"
        >
          <img
            src="/opening_logo.png"
            alt={BRAND_CONFIG.brandName}
            className="w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 object-contain drop-shadow-[0_0_35px_rgba(37,99,235,0.25)] select-none"
          />
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="mb-3"
        >
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            <span style={{ color: '#00306e' }}>
              LVSkill
            </span>
            <span style={{ color: '#da9719' }}>
              Sync
            </span>
          </h1>
        </motion.div>

        {/* Tagline / Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-sm mb-8 leading-relaxed"
        >
          Connecting Skills with Opportunities
        </motion.p>

        {/* Standard Clean Website Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium"
        >
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span>Loading workspace...</span>
        </motion.div>
      </div>

      {/* Subtle bottom indicator */}
      <div className="absolute bottom-6 text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
        Student Digital Career Platform
      </div>
    </motion.div>
  );
}
