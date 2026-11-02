import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Users, CheckCircle2, X, Sparkles, AlertCircle } from 'lucide-react';

export default function ConfirmationModals() {
  const {
    isSignOutAlertOpen,
    closeSignOutAlert,
    confirmSignOut,
    collaborateTarget,
    closeCollaborateAlert,
    confirmCollaborate,
    applyTarget,
    closeApplyAlert,
    confirmApplyJob,
  } = useAppContext();

  return (
    <>
      {/* 1. Sign Out Confirmation Modal */}
      <AnimatePresence>
        {isSignOutAlertOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSignOutAlert}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#111E38] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center z-10 overflow-hidden"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <LogOut className="w-7 h-7" />
              </div>

              <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                Do you want to sign out?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                You will need to sign in again to access your student portfolio, active proposals, and client messages.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeSignOutAlert}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmSignOut}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Collaborate Confirmation Modal */}
      <AnimatePresence>
        {collaborateTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCollaborateAlert}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#111E38] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center z-10 overflow-hidden"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Sparkles className="w-7 h-7 text-amber-500" />
              </div>

              <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                Do you want to collaborate with {collaborateTarget.name}?
              </h3>
              
              <div className="my-4 p-3 bg-slate-50 dark:bg-[#0B132B]/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 text-left">
                <div className="relative flex-shrink-0">
                  <img
                    src={collaborateTarget.avatar}
                    alt={collaborateTarget.name}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  {collaborateTarget.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#111E38] p-0.5 rounded-full shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-600 text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-heading font-bold text-xs text-slate-900 dark:text-white truncate">
                    {collaborateTarget.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {collaborateTarget.skill}
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    La Verdad Student Creator
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                This will start a direct collaboration conversation and send a project collaboration invitation.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeCollaborateAlert}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmCollaborate}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  Yes, Collaborate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* 3. Apply Gig Confirmation Modal */}
      <AnimatePresence>
        {applyTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeApplyAlert}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#111E38] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center z-10 overflow-hidden"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                Do you want to apply to this gig?
              </h3>

              <div className="my-4 p-3 bg-slate-50 dark:bg-[#0B132B]/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block mb-0.5">
                  {applyTarget.company}
                </span>
                <h4 className="font-heading font-bold text-xs text-slate-900 dark:text-white leading-snug line-clamp-1">
                  {applyTarget.title}
                </h4>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500">Budget:</span>
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{applyTarget.budget}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Your attached student portfolio and resume will be submitted instantly with 0% platform commission.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeApplyAlert}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmApplyJob}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  Yes, Apply Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
