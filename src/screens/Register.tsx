import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../AppContext';
import { Mail, Lock, User as UserIcon, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Moon, Sun } from 'lucide-react';

import BrandLogo from '../components/BrandLogo';

export default function Register() {
  const { setCurrentScreen, register, isAuthLoading, theme, setTheme } = useAppContext();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [googleAccount, setGoogleAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Frontend validation
    if (!firstName.trim()) {
      setErrorMessage('First Name is required.');
      return;
    }
    if (!lastName.trim()) {
      setErrorMessage('Last Name is required.');
      return;
    }
    if (!googleAccount.trim()) {
      setErrorMessage('Google Account is required.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const res = await register({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      google_account: googleAccount.trim(),
      password,
      account_type: 'Freelancer',
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed.');
    } else {
      setSuccessMessage(res.message || `Account created successfully. Welcome, ${firstName.trim()}!`);
      // Transition to Main screen
      setTimeout(() => {
        setCurrentScreen('Main');
      }, 1200);
    }
  };

  return (
    <motion.div
      id="register-screen"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#070D1F] p-4 sm:p-8 justify-center"
    >
      <div className="max-w-2xl mx-auto w-full bg-white dark:bg-[#111E38] p-6 sm:p-10 rounded-3xl shadow-md border border-slate-200/80 dark:border-slate-800 my-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <button
            id="register-back-btn"
            onClick={() => setCurrentScreen('Login')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span>Back to Login</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === 'Light' ? 'Dark' : 'Light')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle theme"
            >
              {theme === 'Light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <BrandLogo imageSrc="/main_logo.png" size="md" showText lightText={false} />
          </div>
        </div>

        <div className="pb-2">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B192C] dark:text-white tracking-tight mb-1.5">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            Create your account to browse gigs, post opportunities, and collaborate with peers.
          </p>
        </div>

        {/* Feedback Alerts */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="register-error-alert"
              className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 mb-4"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{errorMessage}</div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="register-success-alert"
              className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2.5 mb-4"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="font-semibold leading-relaxed">{successMessage}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                First Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-blue-600" strokeWidth={1.8} />
                </div>
                <input
                  id="register-firstname"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all"
                  placeholder="e.g. Jhazzley"
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-blue-600" strokeWidth={1.8} />
                </div>
                <input
                  id="register-lastname"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all"
                  placeholder="e.g. Pore"
                />
              </div>
            </div>
          </div>

          {/* Google Account */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Google Account <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-blue-600" strokeWidth={1.8} />
              </div>
              <input
                id="register-google-account"
                type="email"
                required
                value={googleAccount}
                onChange={(e) => setGoogleAccount(e.target.value)}
                className="block w-full pl-10 pr-3.5 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all"
                placeholder="e.g. jhazzley.pore@student.laverdad.edu.ph"
              />
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Must be unique. Institutional LV accounts or standard Google accounts supported.
            </span>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-blue-600" strokeWidth={1.8} />
              </div>
              <input
                id="register-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3.5 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all"
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-blue-600" strokeWidth={1.8} />
              </div>
              <input
                id="register-confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3.5 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all"
                placeholder="Re-type your password"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[12px] text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>
              Your password will be securely salted and hashed in our SQL database. Plaintext passwords are never stored or logged.
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isAuthLoading}
            id="register-submit-btn"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-colors mt-2 disabled:opacity-70 cursor-pointer"
          >
            {isAuthLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account in SQL Database...</span>
              </>
            ) : (
              <span>Create My Account</span>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Already registered?{' '}
            <button
              id="register-go-to-login"
              onClick={() => setCurrentScreen('Login')}
              className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 underline underline-offset-2 ml-1"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
