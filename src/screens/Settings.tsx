import { useAppContext } from '../AppContext';
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Globe,
  Lock,
  Info,
  LogOut,
  ChevronRight,
  School,
  ShieldCheck,
  Wallet,
  Database,
  CheckCircle2,
  XCircle,
  Play,
  Loader2,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface DiagnosticResult {
  test: string;
  passed: boolean;
  details: string;
}

export default function Settings() {
  const { 
    setCurrentScreen, 
    goBack, 
    theme, 
    setTheme, 
    notifications, 
    setNotifications, 
    authenticatedUser, 
    requestSignOut 
  } = useAppContext();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<DiagnosticResult[] | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const runDiagnostics = async () => {
    try {
      setIsRunningTests(true);
      const res = await fetch('/api/auth/run-diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.results) {
        setTestResults(data.results);
      } else {
        showToast('Diagnostics failed: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      showToast('Diagnostics connection error: ' + err.message);
    } finally {
      setIsRunningTests(false);
    }
  };

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        { 
          icon: theme === 'Light' ? Moon : Sun, 
          label: 'Display Theme', 
          value: theme, 
          onClick: () => {
            const newTheme = theme === 'Light' ? 'Dark' : 'Light';
            setTheme(newTheme);
            showToast(`Theme switched to ${newTheme} Mode`);
          } 
        },
        { 
          icon: Bell, 
          label: 'Push & Gig Alerts', 
          value: notifications, 
          onClick: () => {
            const newNotif = notifications === 'On' ? 'Off' : 'On';
            setNotifications(newNotif);
            showToast(`Notifications set to ${newNotif}`);
          } 
        },
        { 
          icon: Globe, 
          label: 'App Language', 
          value: 'English (PH)', 
          onClick: () => showToast('Filipino & English available') 
        },
      ]
    },
    {
      title: 'Student Freelance Account',
      items: [
        { 
          icon: School, 
          label: 'Campus / Department', 
          value: 'LV College - BSCS/ACT', 
          onClick: () => showToast('Campus: La Verdad Christian College') 
        },
        { 
          icon: Wallet, 
          label: 'Payout Accounts', 
          value: 'GCash (0917***1234)', 
          onClick: () => showToast('Payout account verified & linked') 
        },
        { 
          icon: ShieldCheck, 
          label: 'Student ID Verification', 
          value: 'Verified', 
          highlight: true,
          onClick: () => showToast('Student ID is verified with registrar') 
        },
      ]
    },
    {
      title: 'SQL Database & Security Tests',
      items: [
        { 
          icon: Database, 
          label: 'Run 5-Step SQL & Auth Verification', 
          value: 'Tests 1–5', 
          highlight: true,
          onClick: () => {
            setIsTestModalOpen(true);
            if (!testResults) {
              runDiagnostics();
            }
          } 
        },
        { 
          icon: Lock, 
          label: 'Password Hash Algorithm', 
          value: 'Argon2 / Bcrypt-12', 
          onClick: () => showToast('Salted & hashed passwords never stored in plaintext') 
        },
        { 
          icon: Info, 
          label: 'About LVSkillSync', 
          value: 'v1.2.0 • SQL Connected', 
          onClick: () => showToast('LVSkillSync: Empowering Student Freelancers') 
        },
      ]
    }
  ];

  return (
    <motion.div 
      id="settings-screen"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-white"
    >
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-[#0B192C] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl sm:rounded-full shadow-xl font-medium text-[11px] sm:text-xs tracking-tight flex items-center justify-center gap-2 border border-slate-700/80 max-w-[90vw] sm:max-w-md text-center leading-snug break-words"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagnostics Modal */}
      <AnimatePresence>
        {isTestModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B192C]/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111E38] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <h3 className="font-heading font-extrabold text-base text-[#0B192C] dark:text-white">
                    SQL & Auth System Test Suite
                  </h3>
                </div>
                <button
                  onClick={() => setIsTestModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 my-3">
                Validates the 5 mandatory requirements: New Account Creation, Duplicate Prevention via Database UNIQUE constraint, Multiple Users Isolation, Logout Session Invalidation, and Security SQL Injection Prevention.
              </p>

              <div className="flex-1 overflow-y-auto space-y-2.5 my-2 pr-1">
                {isRunningTests && (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-7 h-7 text-blue-600 animate-spin mb-2" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Executing Database & Constraint Verification...
                    </span>
                  </div>
                )}

                {!isRunningTests && testResults && (
                  testResults.map((r, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border text-xs ${
                        r.passed
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
                          : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 font-bold">
                          {r.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          )}
                          <span className={r.passed ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200'}>
                            {r.test}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.passed ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                        }`}>
                          {r.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                        {r.details}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={runDiagnostics}
                  disabled={isRunningTests}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Re-run Verification Suite</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="w-full bg-slate-50/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5 py-3.5 flex items-center">
          <button 
            id="settings-back-btn"
            onClick={() => goBack()}
            className="w-10 h-10 rounded-xl bg-white dark:bg-[#111E38] shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
          </button>
          <div className="ml-3">
            <h1 className="font-heading font-extrabold text-base sm:text-lg text-[#0B192C] dark:text-white leading-tight">
              Settings & Preferences
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Account, branding, notifications & security controls
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-5 pb-28 sm:pb-20">
        {/* Authenticated User Banner */}
        {authenticatedUser && (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#111E38] border border-blue-100 dark:border-blue-900/40 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  Active Database Account
                </span>
                <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                  {authenticatedUser.first_name} {authenticatedUser.last_name}
                </span>
              </div>
            </div>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Google Account:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{authenticatedUser.google_account}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User ID:</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{authenticatedUser.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SQL Engine:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">SQLite WAL (Indexed & Normalized)</span>
              </div>
            </div>
          </div>
        )}

        {settingsGroups.map((group, idx) => (
          <div key={idx}>
            <h2 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 ml-1">
              {group.title}
            </h2>
            <div className="bg-white dark:bg-[#111E38] rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              {group.items.map((item, i) => (
                <div 
                  key={i} 
                  onClick={item.onClick} 
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="font-heading font-medium text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        item.highlight 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {item.value}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <button 
            id="settings-logout-btn"
            onClick={requestSignOut}
            className="w-full flex items-center justify-center gap-2 p-3.5 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-semibold text-xs hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of LVSkillSync</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
