import { useState } from 'react';
import { useAppContext } from '../AppContext';
import { ArrowLeft, Bookmark, Share2, MapPin, Clock, Briefcase, CheckCircle2, ShieldCheck, Sparkles, Send, Calculator, FileText, Trash2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function JobDetails() {
  const { 
    selectedJob, 
    goBack, 
    setCurrentScreen, 
    userProfile, 
    setCurrentTab,
    isJobSaved,
    toggleSaveJob,
    isJobApplied,
    requestApplyJob,
    withdrawApplication,
    setSelectedChat,
    ensureChatThread,
  } = useAppContext();
  const [showSuccess, setShowSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!selectedJob) return null;

  const isSaved = isJobSaved(selectedJob.id);
  const isApplied = isJobApplied(selectedJob.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApply = () => {
    if (!userProfile.resume) {
      showToast('Please upload a resume first before submitting a student proposal.');
      return;
    }
    requestApplyJob(selectedJob);
  };

  const handleWithdraw = () => {
    withdrawApplication(selectedJob.id);
    showToast(`Withdrew proposal for "${selectedJob.title}".`);
  };

  const handleShare = () => {
    const link = `lvskillsync.edu/opportunities/${selectedJob.title.replace(/\s+/g, '-').toLowerCase()}`;
    showToast(`Opportunity link copied: ${link}`);
  };

  const handleSave = () => {
    const nextSaved = toggleSaveJob(selectedJob.id);
    showToast(nextSaved ? 'Gig bookmarked to your student saved list!' : 'Removed from saved list.');
  };

  const handleOpenChat = () => {
    const chatThread = {
      id: 'chat_' + selectedJob.id,
      userId: 'client_' + selectedJob.id,
      name: selectedJob.clientName,
      avatar: `https://i.pravatar.cc/150?u=${selectedJob.clientName}`,
      lastMessage: `Hello regarding ${selectedJob.title}`,
      timestamp: 'Just now',
      unread: false,
    };
    ensureChatThread(chatThread);
    setSelectedChat(chatThread);
    setCurrentScreen('Chat');
  };

  return (
    <motion.div 
      id="job-details-screen"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B132B] relative text-slate-800 dark:text-slate-100"
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

      {/* Top Header */}
      <div className="w-full bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <button 
            id="job-details-back-btn"
            onClick={() => goBack()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span className="hidden sm:inline">Back to Opportunities</span>
          </button>

          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Opportunity Overview
          </span>

          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className={`p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors ${
                isSaved ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' : 'bg-white dark:bg-[#111E38] text-slate-600 dark:text-slate-300'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} strokeWidth={1.8} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white dark:bg-[#111E38] border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols): Description & Competencies */}
          <div className="lg:col-span-8 bg-white dark:bg-[#111E38] p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/40 mb-2.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{selectedJob.category}</span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B192C] dark:text-white tracking-tight leading-snug">
                {selectedJob.title}
              </h1>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                {selectedJob.company}
              </p>
            </div>

            {/* Project Meta Chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                Flexible Freelance
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Remote Friendly
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Estimated 10-15 hrs/wk
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B192C] dark:text-white uppercase tracking-wider mb-2">
                Project Overview
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {selectedJob.description}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#0B192C] dark:text-white uppercase tracking-wider mb-2.5">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60 text-xs font-semibold rounded-xl"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Budget Card, Client Info, Apply Action */}
          <div className="lg:col-span-4 space-y-5">
            {/* Budget & Escrow Card */}
            <div className="bg-white dark:bg-[#111E38] p-5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Budget
                </span>
                <p className="font-heading font-extrabold text-3xl text-blue-600 dark:text-blue-400">
                  {selectedJob.budget}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secured in Escrow</span>
                </div>
              </div>

              <div className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Submission Due:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedJob.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Platform Commission:</span>
                  <span className="font-bold text-emerald-600">0%</span>
                </div>
              </div>

              {/* Calculator helper link */}
              <button
                onClick={() => setCurrentScreen('Calculator')}
                className="w-full mt-2 mb-4 py-2 bg-slate-50 dark:bg-[#0B132B] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Calculator className="w-3.5 h-3.5 text-blue-600" />
                <span>Calculate Take-Home</span>
              </button>

              {/* Attached Student Resume Indicator */}
              <div className="mb-4">
                {userProfile.resume ? (
                  <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block leading-tight">
                          Attached Resume
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate block">
                          {userProfile.resume.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full flex-shrink-0">
                      Attached
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <FileText className="w-4 h-4" />
                      <span>No resume attached yet</span>
                    </div>
                    <button
                      onClick={() => {
                        goBack();
                        setCurrentTab('Profile');
                      }}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-[11px]"
                    >
                      Upload in Profile
                    </button>
                  </div>
                )}
              </div>

              {/* Proposal Action (Desktop sidebar view only; on mobile the sticky bottom bar is used) */}
              <div className="hidden lg:block">
                {isApplied ? (
                  <div className="space-y-2">
                    <div className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-emerald-600/90 text-white shadow-sm flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Proposal Submitted (Under Review)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleWithdraw}
                      className="w-full py-2 px-3 rounded-xl font-semibold text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Withdraw Proposal</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    id="job-details-apply-btn"
                    onClick={handleApply}
                    className="w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Student Proposal</span>
                  </button>
                )}
              </div>
            </div>

            {/* Client Card */}
            <div className="bg-white dark:bg-[#111E38] p-5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                About the Client
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center font-heading font-extrabold text-lg">
                  {selectedJob.clientName.charAt(0)}
                </div>
                <div>
                  <p className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                    {selectedJob.clientName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedJob.company}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800 mb-3">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Employer
                </span>
                <span className="text-amber-500 font-bold">
                  ★ 4.9
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenChat}
                className="w-full py-2.5 px-3 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-blue-200 dark:border-blue-900/40 cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Client</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom CTA for mobile screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 p-4 z-20 shadow-[0_-4px_16px_rgba(11,25,44,0.06)]">
        <div className="max-w-md mx-auto">
          {isApplied ? (
            <div className="flex items-center gap-2.5">
              <div className="flex-1 py-3 px-4 bg-emerald-600/90 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Proposal Submitted</span>
              </div>
              <button 
                type="button"
                onClick={handleWithdraw}
                className="py-3 px-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Withdraw</span>
              </button>
            </div>
          ) : (
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={handleApply}
              id="job-details-apply-mobile-btn"
              className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Student Proposal</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B192C]/60 backdrop-blur-sm px-6"
          >
            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white dark:bg-[#111E38] rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white mb-1">
                Proposal Submitted!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Your portfolio & proposal have been sent to {selectedJob.clientName}. Check your Messages for updates.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
