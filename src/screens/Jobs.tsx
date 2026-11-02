import { useState, useEffect, FormEvent } from 'react';
import { categories } from '../data';
import { useAppContext } from '../AppContext';
import { Job } from '../types';
import { 
  Briefcase, Calendar, CheckCircle2, Bookmark, 
  ArrowUpRight, Send, Trash2, Search, Sparkles, Clock, AlertCircle, Plus, X, Building, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Jobs() {
  const { 
    setCurrentScreen, 
    setSelectedJob, 
    jobsList,
    myPostedJobs,
    postJob,
    deleteJob,
    toggleSaveJob, 
    requestApplyJob,
    withdrawApplication,
    isJobSaved, 
    isJobApplied,
    userProfile,
    authenticatedUser,
    requestedJobsTab,
    setRequestedJobsTab
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'All' | 'Applied' | 'Saved' | 'MyPostings'>(requestedJobsTab || 'All');

  // Sync activeTab when requestedJobsTab changes
  useEffect(() => {
    if (requestedJobsTab) {
      setActiveTab(requestedJobsTab);
    }
  }, [requestedJobsTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Post a Gig Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0] || 'Web Development');
  const [formBudget, setFormBudget] = useState('₱3,500');
  const [formDeadline, setFormDeadline] = useState('5 days');
  const [formSkills, setFormSkills] = useState('React, Tailwind CSS');
  const [formCompany, setFormCompany] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const appliedJobs = jobsList.filter(j => isJobApplied(j.id));
  const savedJobs = jobsList.filter(j => isJobSaved(j.id));

  // Filter based on active tab, search, and category
  const baseList = activeTab === 'All' 
    ? jobsList 
    : activeTab === 'Applied' 
    ? appliedJobs 
    : activeTab === 'Saved'
    ? savedJobs
    : myPostedJobs;

  const displayedJobs = baseList.filter(j => {
    const matchesSearch = 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || j.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleQuickApply = (job: Job) => {
    if (!userProfile.resume) {
      showToast('Please upload a resume first before submitting a student proposal.');
      return;
    }
    requestApplyJob(job);
  };

  const handleWithdraw = (jobId: string, title: string) => {
    withdrawApplication(jobId);
    showToast(`Withdrew proposal for "${title}".`);
  };

  const handleDeleteMyJob = (jobId: string, title: string) => {
    deleteJob(jobId);
    showToast(`Deleted posted gig "${title}".`);
  };

  // Sample gig data filler for quick testing
  const handleLoadSampleGig = () => {
    const defaultAuthor = authenticatedUser 
      ? `${authenticatedUser.first_name} ${authenticatedUser.last_name}`
      : userProfile.name;
    setFormTitle('Interactive Portfolio Webpage for Student Showcase');
    setFormCategory('Web Development');
    setFormBudget('₱4,500');
    setFormDeadline('7 days');
    setFormSkills('React, Tailwind CSS, TypeScript');
    setFormCompany(defaultAuthor ? `${defaultAuthor} Studio` : 'LVCC Design Lab');
    setFormDescription('Looking for a talented student freelancer to build a clean, responsive student showcase portfolio with interactive project cards and dark mode support.');
  };

  const handleCreateJob = (e: FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      showToast('Please provide a gig title and project description.');
      return;
    }

    const defaultAuthor = authenticatedUser 
      ? `${authenticatedUser.first_name} ${authenticatedUser.last_name}`
      : userProfile.name;

    const skillsArray = formSkills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const formattedBudget = formBudget.trim().startsWith('₱') 
      ? formBudget.trim() 
      : `₱${formBudget.trim()}`;

    const newJob = postJob({
      title: formTitle.trim(),
      category: formCategory,
      budget: formattedBudget || '₱3,000',
      deadline: formDeadline.trim() || '7 days',
      company: formCompany.trim() || `${defaultAuthor} Studio`,
      clientName: defaultAuthor || 'Student Client',
      description: formDescription.trim(),
      skills: skillsArray.length > 0 ? skillsArray : ['Collaboration', 'Student Project'],
    });

    setIsPostModalOpen(false);
    // Reset form fields
    setFormTitle('');
    setFormDescription('');
    setFormSkills('React, Tailwind CSS');
    setActiveTab('MyPostings');
    showToast(`Gig "${newJob.title}" posted successfully!`);
  };

  return (
    <div id="jobs-screen" className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 relative bg-slate-50 dark:bg-[#0B132B] min-h-screen">
      {/* Toast Notification */}
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

      {/* Post a Gig Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B192C]/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-white dark:bg-[#111E38] rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase">
                      Client & Hirer Action
                    </span>
                  </div>
                  <h2 className="font-heading font-extrabold text-xl text-[#0B192C] dark:text-white mt-1">
                    Post a Student Gig
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Create opportunities for fellow student creators to collaborate and apply.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-3.5 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gig Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Redesign Landing Page in Figma"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-600/40 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Skill Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-600/40 outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Estimated Budget (PHP) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₱3,500"
                      value={formBudget}
                      onChange={(e) => setFormBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-600/40 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Turnaround / Due Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5 days or Oct 25"
                      value={formDeadline}
                      onChange={(e) => setFormDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-600/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Student Org or Studio"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-600/40 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Required Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Tailwind CSS, TypeScript"
                    value={formSkills}
                    onChange={(e) => setFormSkills(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-600/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Project Scope & Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide detailed expectations, deliverables, and requirements for applicants..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-600/40 outline-none leading-relaxed resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleLoadSampleGig}
                    className="px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Fill Sample</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPostModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                    >
                      Post Gig Now
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5 pt-1">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B192C] dark:text-white tracking-tight">
            Explore Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Browse, apply, or post student-friendly freelance gigs.
          </p>
        </div>

        {/* Post a Gig CTA */}
        <button
          id="jobs-post-gig-btn"
          onClick={() => {
            const defaultAuthor = authenticatedUser 
              ? `${authenticatedUser.first_name} ${authenticatedUser.last_name}`
              : userProfile.name;
            setFormCompany(defaultAuthor ? `${defaultAuthor} Studio` : 'LVCC Design Lab');
            setIsPostModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post a Gig</span>
        </button>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gigs or skills..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111E38] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/40 shadow-xs placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by skill track"
            className="px-3.5 py-2.5 bg-white dark:bg-[#111E38] rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/40 cursor-pointer shadow-xs"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pill tabs: All, Applied, Saved, My Postings */}
      <div className="flex p-1 bg-slate-200/70 dark:bg-slate-900/60 rounded-xl mb-6 max-w-xl border border-slate-200/60 dark:border-slate-800 overflow-x-auto">
        <button
          id="jobs-tab-all"
          onClick={() => setActiveTab('All')}
          className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'All' 
              ? 'bg-white dark:bg-[#111E38] text-blue-600 dark:text-blue-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Gigs ({jobsList.length})
        </button>
        <button
          id="jobs-tab-applied"
          onClick={() => {
            setActiveTab('Applied');
            showToast(`Viewing ${appliedJobs.length} active student proposals`);
          }}
          className={`flex-1 min-w-[75px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'Applied' 
              ? 'bg-white dark:bg-[#111E38] text-emerald-600 dark:text-emerald-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Applied</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'Applied' 
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
              : 'bg-slate-300/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {appliedJobs.length}
          </span>
        </button>
        <button
          id="jobs-tab-saved"
          onClick={() => {
            setActiveTab('Saved');
            showToast(`Viewing ${savedJobs.length} saved gigs`);
          }}
          className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'Saved' 
              ? 'bg-white dark:bg-[#111E38] text-blue-600 dark:text-blue-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Saved</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'Saved' 
              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' 
              : 'bg-slate-300/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {savedJobs.length}
          </span>
        </button>
        <button
          id="jobs-tab-mypostings"
          onClick={() => {
            setActiveTab('MyPostings');
            showToast(`Viewing ${myPostedJobs.length} student gig postings`);
          }}
          className={`flex-1 min-w-[95px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'MyPostings' 
              ? 'bg-white dark:bg-[#111E38] text-indigo-600 dark:text-indigo-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>My Postings</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'MyPostings' 
              ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' 
              : 'bg-slate-300/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            {myPostedJobs.length}
          </span>
        </button>
      </div>

      {/* Tab Context Banner */}
      {activeTab === 'Applied' && (
        <div className="mb-5 p-3.5 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Active Student Proposals:</strong> You have submitted proposals to {appliedJobs.length} client opportunities.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hidden sm:inline">
            Status: Under Review
          </span>
        </div>
      )}

      {activeTab === 'Saved' && (
        <div className="mb-5 p-3.5 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl flex items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400 flex-shrink-0" />
            <span>
              <strong>Bookmarked Opportunities:</strong> {savedJobs.length} gigs saved for quick review and proposal submission.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 hidden sm:inline">
            Fast Proposal Ready
          </span>
        </div>
      )}

      {activeTab === 'MyPostings' && (
        <div className="mb-5 p-3.5 bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-xl flex items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span>
              <strong>Your Client & Hirer Postings:</strong> You have created {myPostedJobs.length} live gigs for student talent to explore.
            </span>
          </div>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-300 hover:underline cursor-pointer"
          >
            + Create Another
          </button>
        </div>
      )}

      {/* Gigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
        {displayedJobs.length > 0 ? (
          displayedJobs.map((job) => {
            const saved = isJobSaved(job.id);
            const applied = isJobApplied(job.id);
            const isMyPost = !!job.isMyPost;

            return (
              <motion.div 
                whileTap={{ scale: 0.99 }}
                key={job.id} 
                className={`bg-white dark:bg-[#111E38] p-5 rounded-2xl shadow-sm border transition-all flex flex-col justify-between ${
                  isMyPost
                    ? 'border-indigo-300 dark:border-indigo-800/80 ring-1 ring-indigo-500/20'
                    : applied 
                    ? 'border-emerald-300 dark:border-emerald-900/70 ring-1 ring-emerald-500/20' 
                    : saved 
                    ? 'border-blue-300 dark:border-blue-900/70 ring-1 ring-blue-500/10' 
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="pr-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs truncate">
                          {job.company}
                        </span>
                        {isMyPost && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 px-2 py-0.5 rounded-full">
                            <Sparkles className="w-2.5 h-2.5" />
                            My Posted Gig
                          </span>
                        )}
                        {applied && !isMyPost && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Proposal Sent
                          </span>
                        )}
                        {saved && !applied && !isMyPost && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 px-2 py-0.5 rounded-full">
                            <Bookmark className="w-2.5 h-2.5 fill-blue-600 text-blue-600" />
                            Bookmarked
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base leading-snug">
                        {job.title}
                      </h3>
                    </div>
                    <span className="font-heading font-extrabold text-blue-600 dark:text-blue-400 text-sm whitespace-nowrap bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-xl border border-blue-100 dark:border-blue-900/40">
                      {job.budget}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3 mt-1.5">
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase rounded-md border border-blue-100 dark:border-blue-900/30">
                      {job.category}
                    </span>
                    {job.skills.slice(0, 2).map((skill, i) => (
                      <span
                        key={i} 
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[10px] font-medium rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 2 && (
                      <span className="text-[10px] text-slate-400 self-center font-medium">
                        +{job.skills.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs mt-2">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {job.deadline}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {isMyPost ? 'Created by you' : `Client: ${job.clientName}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    {/* If user's own posting */}
                    {isMyPost ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDeleteMyJob(job.id, job.title)}
                          className="px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-rose-200 dark:border-rose-900/50"
                          title="Delete this gig posting"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Post</span>
                        </button>

                        <button 
                          type="button"
                          onClick={() => {
                            setSelectedJob(job);
                            setCurrentScreen('JobDetails');
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>Manage Gig</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Bookmark Toggle */}
                        <button 
                          type="button"
                          onClick={() => {
                            const isNowSaved = toggleSaveJob(job.id);
                            showToast(isNowSaved ? `"${job.title}" saved to bookmarks!` : `Removed "${job.title}" from bookmarks.`);
                          }}
                          className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                            saved 
                              ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                          }`}
                          title={saved ? 'Remove from saved' : 'Save opportunity'}
                        >
                          <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600 text-blue-600' : ''}`} />
                          <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {/* If Applied: option to withdraw or view proposal */}
                          {applied ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleWithdraw(job.id, job.title)}
                                className="px-2.5 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                title="Withdraw submitted proposal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Withdraw</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setCurrentScreen('JobDetails');
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <span>View Gig</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Quick Apply Button */}
                              <button
                                type="button"
                                onClick={() => handleQuickApply(job)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                                title="Submit proposal using your profile resume"
                              >
                                <Send className="w-3 h-3" />
                                <span>Apply</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setCurrentScreen('JobDetails');
                                }}
                                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>Details</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 px-6 bg-white dark:bg-[#111E38] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm mb-1">
              No {activeTab === 'MyPostings' ? 'posted' : activeTab.toLowerCase()} gigs found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4 leading-relaxed">
              {activeTab === 'MyPostings'
                ? "You haven't posted any gigs yet. Tap '+ Post a Gig' to create an opportunity for other student freelancers!"
                : activeTab === 'Applied' 
                ? 'You have not submitted proposals to any gigs yet. Browse opportunities and submit your proposal using your verified student CV!'
                : activeTab === 'Saved'
                ? 'You have no bookmarked gigs yet. Tap the bookmark icon on any opportunity card to save it for quick access later.'
                : 'No opportunities matched your search criteria. Try a different keyword or category.'}
            </p>
            {activeTab === 'MyPostings' ? (
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors cursor-pointer"
              >
                + Post a Gig Now
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('All');
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Browse All Opportunities
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
