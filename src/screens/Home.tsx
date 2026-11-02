import { 
  Search, Star, CheckCircle, Briefcase, Users, ArrowUpRight, 
  Calculator, Upload, Sparkles, ShieldCheck, ChevronLeft, ChevronRight,
  Bookmark, CheckCircle2, UserPlus, UserCheck, PlusCircle 
} from 'lucide-react';
import { currentUser, categories, featuredFreelancers } from '../data';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';

export default function Home() {
  const { 
    setCurrentScreen, 
    setSelectedJob, 
    setCurrentTab, 
    authenticatedUser, 
    userProfile,
    toggleSaveJob,
    isJobSaved,
    isJobApplied,
    updateProfileDetails,
    setSelectedFreelancer,
    popularCategories,
    jobsList,
    toggleFollowFreelancer,
    isFollowingFreelancer,
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const displayName = authenticatedUser ? authenticatedUser.first_name : userProfile.name.split(' ')[0];
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollTracks = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 220;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  const filteredFreelancers = featuredFreelancers.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobs = jobsList.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeAvatar = userProfile.avatar || authenticatedUser?.avatar_url || "https://i.pravatar.cc/150?u=u1";

  return (
    <div id="home-screen" className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 space-y-6 relative bg-slate-50 dark:bg-[#0B132B] min-h-screen">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-[#0B192C] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl sm:rounded-full shadow-xl font-medium text-[11px] sm:text-xs tracking-tight flex items-center justify-center gap-2 border border-slate-700 max-w-[90vw] sm:max-w-md text-center leading-snug break-words"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Greeting */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-1">
        <div>
          <h1 id="home-greeting-heading" className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B192C] dark:text-white tracking-tight">
            Hi, {displayName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Find client gigs, post freelance jobs, and collaborate with peers.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-blue-600" strokeWidth={2} />
            </div>
            <input
              id="home-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-3.5 bg-white dark:bg-[#111E38] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white transition-all outline-none"
              placeholder="Search gigs, skills, or clients..."
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-300 font-bold text-lg"
              >
                ×
              </button>
            )}
          </div>

          {/* Skill Tracks Filter */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-heading font-bold text-xs sm:text-sm text-[#0B192C] dark:text-white uppercase tracking-wider">
                Skill Tracks
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 bg-white dark:bg-[#111E38] border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xs">
                  <button
                    onClick={() => scrollTracks('left')}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Scroll left"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => scrollTracks('right')}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Scroll right"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button 
                  onClick={() => setCurrentTab('Jobs')}
                  className="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>
            </div>
            <div ref={scrollContainerRef} className="flex overflow-x-auto gap-2.5 pb-1 no-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0 scroll-smooth">
              {popularCategories.map((cat, i) => {
                const isSelected = searchQuery === cat;
                return (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSearchQuery(isSelected ? '' : cat)}
                    key={`${cat}-${i}`} 
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex-shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white dark:bg-[#111E38] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-blue-500'}`} />
                    <span>{cat}</span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Student Accelerator Banner (Responsive Light/Dark Theme) */}
          <div 
            id="home-career-banner"
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md border border-blue-500/20 dark:from-[#0B192C] dark:via-[#111E38] dark:to-[#0B192C] dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-lg">
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white leading-snug">
                Student Freelance & Hirer Hub
              </h3>
              <p className="text-blue-100 dark:text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                Connect directly with clients, post project opportunities, or collaborate with campus peers.
              </p>
            </div>
            <div className="relative z-10 flex-shrink-0 flex flex-wrap gap-2.5">
              <button 
                onClick={() => setCurrentTab('Jobs')}
                className="bg-white text-blue-700 hover:bg-blue-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Browse Gigs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setCurrentTab('Jobs')}
                className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post a Gig</span>
              </button>
            </div>
          </div>

          {/* Featured Student Freelancers */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="font-heading font-bold text-xs sm:text-sm text-[#0B192C] dark:text-white uppercase tracking-wider">
                  {searchQuery ? 'Matching Student Creators' : 'Top Student Freelancers'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verified student creators ready for hire
                </p>
              </div>
            </div>
            
            {filteredFreelancers.length > 0 ? (
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  {filteredFreelancers.slice(0, 4).map((freelancer) => {
                    const isFollowing = isFollowingFreelancer(freelancer.id);
                    return (
                      <div
                        key={freelancer.id}
                        className="bg-white dark:bg-[#111E38] p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col items-center text-center hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all relative"
                      >
                        {/* Follow Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextState = toggleFollowFreelancer(freelancer.id);
                            showToast(nextState ? `Now following ${freelancer.name}` : `Unfollowed ${freelancer.name}`);
                          }}
                          className={`absolute top-2.5 right-2.5 p-1 rounded-lg border text-[10px] font-semibold transition-all flex items-center justify-center cursor-pointer ${
                            isFollowing
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                              : 'bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-blue-600'
                          }`}
                          title={isFollowing ? 'Following creator' : 'Follow creator'}
                          aria-label={isFollowing ? 'Following' : 'Follow'}
                        >
                          {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                        </button>

                        <div className="relative mb-2.5 mt-1">
                          <img src={freelancer.avatar} alt={freelancer.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-700" />
                          {freelancer.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#111E38] p-0.5 rounded-full shadow-sm">
                              <CheckCircle className="w-4 h-4 text-blue-600 fill-blue-600 text-white" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-heading font-bold text-slate-900 dark:text-white text-xs leading-snug line-clamp-1">
                          {freelancer.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 line-clamp-1 font-medium">
                          {freelancer.skill}
                        </p>
                        
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold mb-3">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{freelancer.rating}</span>
                          <span className="text-slate-300 dark:text-slate-600 font-normal">•</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                            {freelancer.hiring_status === 'hiring' ? 'Hiring' : freelancer.hiring_status === 'open_to_offers' ? 'Open' : 'Available'}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedFreelancer(freelancer);
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                            setCurrentScreen('FreelancerProfile');
                          }}
                          className="w-full py-1.5 px-2 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 text-blue-600 hover:text-white dark:text-blue-400 dark:hover:text-white border border-blue-200 dark:border-blue-900/60 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>View</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {filteredFreelancers.length > 4 && (
                  <div className="text-center pt-1">
                    <button
                      onClick={() => {
                        setCurrentTab('Freelancers');
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      }}
                      className="px-4 py-2 bg-white dark:bg-[#111E38] hover:bg-slate-50 dark:hover:bg-[#152547] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>See More Student Freelancers ({featuredFreelancers.length})</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-white dark:bg-[#111E38] rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                No matching student freelancers found for "{searchQuery}".
              </div>
            )}
          </section>

          {/* Recent Opportunities */}
          <section className="pb-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="font-heading font-bold text-xs sm:text-sm text-[#0B192C] dark:text-white uppercase tracking-wider">
                  {searchQuery ? 'Matching Opportunities' : 'Recent Opportunities'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Paid gigs tailored to student schedules
                </p>
              </div>
            </div>
            {filteredJobs.length > 0 ? (
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredJobs.slice(0, 4).map((job) => {
                    const saved = isJobSaved(job.id);
                    const applied = isJobApplied(job.id);

                    return (
                      <motion.div 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedJob(job);
                          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          setCurrentScreen('JobDetails');
                        }}
                        key={job.id} 
                        className={`bg-white dark:bg-[#111E38] p-4 rounded-2xl shadow-sm border transition-all cursor-pointer flex flex-col justify-between ${
                          applied 
                            ? 'border-emerald-300 dark:border-emerald-900/60 ring-1 ring-emerald-500/10' 
                            : saved 
                            ? 'border-blue-300 dark:border-blue-900/60' 
                            : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div className="pr-2 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {job.company}
                                </span>
                                {applied && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-full">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                    Applied
                                  </span>
                                )}
                                {saved && !applied && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded-full">
                                    <Bookmark className="w-2.5 h-2.5 fill-blue-600 text-blue-600" />
                                    Saved
                                  </span>
                                )}
                              </div>
                              <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm leading-snug">
                                {job.title}
                              </h3>
                            </div>
                            <span className="font-heading font-extrabold text-blue-600 dark:text-blue-400 text-sm whitespace-nowrap bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900/40">
                              {job.budget}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded-md uppercase tracking-wider">
                              {job.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextSaved = toggleSaveJob(job.id);
                                showToast(nextSaved ? `Saved "${job.title}"` : `Removed "${job.title}"`);
                              }}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                saved 
                                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800' 
                                  : 'text-slate-400 hover:text-blue-600 border-slate-200 dark:border-slate-700'
                              }`}
                              title={saved ? 'Remove bookmark' : 'Bookmark gig'}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-blue-600' : ''}`} />
                            </button>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedJob(job);
                                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                                setCurrentScreen('JobDetails');
                              }}
                              className={`px-3 py-1 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm ${
                                applied ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              {applied ? 'Sent' : 'Details'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {filteredJobs.length > 4 && (
                  <div className="text-center pt-1">
                    <button
                      onClick={() => {
                        setCurrentTab('Jobs');
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      }}
                      className="px-4 py-2 bg-white dark:bg-[#111E38] hover:bg-slate-50 dark:hover:bg-[#152547] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View More Opportunities ({jobsList.length})</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-white dark:bg-[#111E38] rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                No matching opportunities found for "{searchQuery}".
              </div>
            )}
          </section>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-4 space-y-5">
          {/* Student Profile Quick Snapshot */}
          <div className="bg-white dark:bg-[#111E38] p-5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="flex-shrink-0">
                <img
                  src={activeAvatar}
                  alt="Student Profile"
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-600/30 bg-slate-100 dark:bg-slate-800"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-extrabold text-sm text-[#0B192C] dark:text-white truncate">
                  {userProfile.name}
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold block truncate">
                  {userProfile.skill}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  La Verdad Christian College
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="p-2.5 bg-slate-50 dark:bg-[#0B132B] rounded-xl text-center">
                <span className="font-heading font-extrabold text-base text-slate-900 dark:text-white block">
                  {userProfile.completedProjects}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Completed Gigs</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-[#0B132B] rounded-xl text-center">
                <span className="font-heading font-extrabold text-base text-amber-500 block">
                  ★ {userProfile.rating}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Rating</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentTab('Profile')}
              className="w-full mt-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              View Full Profile & Portfolio
            </button>
          </div>

          {/* Student Career Resources Spotlight Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-[#0B192C] dark:to-[#1E2E48] p-5 rounded-2xl text-slate-800 dark:text-white shadow-sm border border-blue-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-600/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                Career & Hirer Guides
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3.5">
              Practical guides on student freelancing, project pricing, and hiring campus talent.
            </p>
            <button
              onClick={() => showToast('Mentorship guides sent to your registered email!')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Guides</span>
            </button>
          </div>

          {/* Earnings Calculator Shortcut */}
          <div className="bg-white dark:bg-[#111E38] p-5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#0B192C] dark:text-white">
                  Take-Home Calculator
                </h4>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5">
              Estimate your earnings and hourly rates with 0% platform deductions.
            </p>
            <button
              onClick={() => setCurrentScreen('Calculator')}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Open Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
