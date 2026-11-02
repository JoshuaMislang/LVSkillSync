import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../AppContext';
import BrandLogo from '../components/BrandLogo';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  UserCheck, 
  Users,
  ChevronRight,
  X,
  Search,
  Trash2,
  Moon,
  Sun
} from 'lucide-react';

export default function Login() {
  const { setCurrentScreen, login, isAuthLoading, registeredAccounts, deleteRegisteredAccount, theme, setTheme } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('jhazzley.pore@student.laverdad.edu.ph');
  const [password, setPassword] = useState('JhazzleySecure2026!');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const customRegisteredAccounts = registeredAccounts.filter(
    acc => !['jhazzley.pore@student.laverdad.edu.ph', 'joshua.student@lvskillsync.edu'].includes(acc.google_account.toLowerCase())
  );
  const totalAccountsCount = customRegisteredAccounts.length + 2;
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
  const [accountsSearch, setAccountsSearch] = useState('');

  const handleDirectLogin = async (emailToUse: string, passwordToUse: string) => {
    const finalPassword = passwordToUse || 'studentpass123';
    setEmail(emailToUse);
    setPassword(finalPassword);
    setIsAccountsModalOpen(false);
    setErrorMessage(null);
    const res = await login(emailToUse, finalPassword);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please check credentials.');
    } else {
      setSuccessMessage(res.message || 'Authenticated successfully!');
      setTimeout(() => {
        setCurrentScreen('Main');
      }, 600);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your Google Account and Password.');
      return;
    }

    const res = await login(email.trim(), password);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
    } else {
      setSuccessMessage(res.message || 'Authenticated successfully!');
      setTimeout(() => {
        setCurrentScreen('Main');
      }, 700);
    }
  };

  const handlePrefill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <motion.div
      id="login-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-slate-50 dark:bg-[#070D1F] flex flex-col justify-center"
    >
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12">
        
        {/* Desktop Left Hero Branding Panel (Visible on lg: screens >= 1024px) */}
        <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 bg-[#0B192C] text-white p-10 xl:p-16 flex-col justify-between relative overflow-hidden">
          {/* Ambient geometric background lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10">
            <BrandLogo imageSrc="/main_logo.png" size="lg" showText lightText={true} />
          </div>

          {/* Center Pitch */}
          <div className="relative z-10 max-w-xl my-auto py-12 space-y-5">
            <h1 className="font-heading font-extrabold text-3xl xl:text-4xl 2xl:text-5xl text-white tracking-tight leading-tight">
              Transform Student Talents Into Freelance Careers.
            </h1>

            <p className="text-base xl:text-lg text-slate-300 leading-relaxed max-w-lg">
              Connect with clients, take on student-friendly gigs, and earn with zero platform fees.
            </p>
          </div>

          {/* Footer note */}
          <div className="relative z-10 text-xs text-slate-400 pt-4 border-t border-slate-800">
            <span>© 2026 LVSkillSync • La Verdad Christian College</span>
          </div>
        </div>

        {/* Right Form Panel (Adapts to Mobile and Desktop) */}
        <div className="lg:col-span-5 xl:col-span-5 bg-white dark:bg-[#111E38] p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-between min-h-screen">
          
          {/* Mobile Top Header */}
          <div className="lg:hidden flex items-center justify-between mb-8 pt-1">
            <BrandLogo imageSrc="/main_logo.png" size="md" showText lightText={false} />
            <button
              type="button"
              onClick={() => setTheme(theme === 'Light' ? 'Dark' : 'Light')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle theme"
            >
              {theme === 'Light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

          <div className="hidden lg:flex justify-end mb-2">
            <button
              type="button"
              onClick={() => setTheme(theme === 'Light' ? 'Dark' : 'Light')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold"
              title="Toggle theme"
            >
              {theme === 'Light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{theme === 'Light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          <div className="max-w-md w-full mx-auto my-auto py-4">
            <div className="mb-6">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B192C] dark:text-white tracking-tight mb-2">
                Sign In
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Enter your student or client account credentials to continue.
              </p>
            </div>

            {/* Feedback Alerts */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  id="login-error-alert"
                  className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{errorMessage}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  id="login-success-alert"
                  className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Google Account / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student.name@laverdad.edu.ph"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="remember-me"
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setErrorMessage('Please contact campus registrar or support@laverdad.edu.ph for credential resets.')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isAuthLoading}
                id="login-submit-btn"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg transition-all mt-4 disabled:opacity-70 cursor-pointer"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Quick Demo Accounts Section */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 text-center">
                Demo Accounts
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="demo-login-jhazzley"
                  onClick={() => handlePrefill('jhazzley.pore@student.laverdad.edu.ph', 'JhazzleySecure2026!')}
                  className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Jhazzley Pore</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">jhazzley.pore@student...</div>
                </button>

                <button
                  type="button"
                  id="demo-login-joshua"
                  onClick={() => handlePrefill('joshua.student@lvskillsync.edu', 'studentpass123')}
                  className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Joshua Mislang</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">joshua.student@...</div>
                </button>
              </div>

              {/* Accounts List Button directly under the two fixed demo accounts */}
              <div className="mt-3">
                <button
                  type="button"
                  id="open-accounts-list-btn"
                  onClick={() => setIsAccountsModalOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 px-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-xl hover:bg-blue-100/70 dark:hover:bg-blue-900/40 transition-all cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-blue-950 dark:text-blue-100">
                      Accounts List
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
                      {totalAccountsCount} accounts available
                    </span>
                    <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 pb-2 text-center border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              New to LVSkillSync?{' '}
              <button
                id="login-go-to-register"
                onClick={() => setCurrentScreen('Register')}
                className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 underline underline-offset-2 ml-1 cursor-pointer"
              >
                Create Student Account
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Registered Accounts List Modal */}
      <AnimatePresence>
        {isAccountsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#111E38] rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#0c162b]/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                      Accounts Directory
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {totalAccountsCount} accounts available
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAccountsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {/* Search if multiple */}
                {customRegisteredAccounts.length > 2 && (
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search accounts..."
                      value={accountsSearch}
                      onChange={(e) => setAccountsSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                )}

                {/* Newly Registered Accounts Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Created Accounts ({customRegisteredAccounts.length})
                    </span>
                  </div>

                  {customRegisteredAccounts.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800">
                      <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        No custom accounts yet
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Accounts created on the Register page will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {customRegisteredAccounts
                        .filter(acc => {
                          if (!accountsSearch.trim()) return true;
                          const q = accountsSearch.toLowerCase();
                          return (
                            acc.first_name.toLowerCase().includes(q) ||
                            acc.last_name.toLowerCase().includes(q) ||
                            acc.google_account.toLowerCase().includes(q)
                          );
                        })
                        .map(acc => (
                          <div
                            key={acc.user_id || acc.google_account}
                            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {acc.first_name[0]}{acc.last_name[0]}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-heading font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {acc.first_name} {acc.last_name}
                                  </span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    acc.account_type === 'Client'
                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                  }`}>
                                    {acc.account_type || 'Freelancer'}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                  {acc.google_account}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                type="button"
                                title="Pre-fill email and password into the login form"
                                onClick={() => {
                                  const finalPassword = acc.password || 'studentpass123';
                                  setEmail(acc.google_account);
                                  setPassword(finalPassword);
                                  setIsAccountsModalOpen(false);
                                  setSuccessMessage(`Credentials filled for ${acc.first_name}! Click Sign In.`);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                              >
                                Fill
                              </button>
                              <button
                                type="button"
                                title="Log in directly with this account"
                                onClick={() => handleDirectLogin(acc.google_account, acc.password || 'studentpass123')}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                              >
                                Sign In
                              </button>
                              <button
                                type="button"
                                title="Remove from saved accounts list"
                                onClick={() => deleteRegisteredAccount(acc.google_account)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Fixed Demo Accounts Section */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    Fixed Demo Accounts (2)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDirectLogin('jhazzley.pore@student.laverdad.edu.ph', 'JhazzleySecure2026!')}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-blue-400 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Jhazzley Pore</span>
                        </div>
                        <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold group-hover:underline">Sign In &rarr;</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">jhazzley.pore@student.laverdad.edu.ph</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDirectLogin('joshua.student@lvskillsync.edu', 'studentpass123')}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-blue-400 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Joshua Mislang</span>
                        </div>
                        <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold group-hover:underline">Sign In &rarr;</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">joshua.student@lvskillsync.edu</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0c162b] flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Total: <strong className="text-blue-600 dark:text-blue-400 font-bold">{totalAccountsCount} accounts</strong> available ({customRegisteredAccounts.length} custom + 2 demo)
                </span>
                <button
                  type="button"
                  onClick={() => setIsAccountsModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
