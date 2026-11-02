import { useState, useMemo } from 'react';
import { featuredFreelancers, categories } from '../data';
import { useAppContext } from '../AppContext';
import { 
  Search, Star, CheckCircle2, ShieldCheck, ArrowUpRight, 
  Sparkles, Filter, GraduationCap, MapPin, UserPlus, UserCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HiringStatus } from '../types';

export default function Freelancers() {
  const { 
    setSelectedFreelancer, 
    setCurrentScreen, 
    requestCollaborate,
    followingFreelancerIds,
    toggleFollowFreelancer,
    isFollowingFreelancer,
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'following' | HiringStatus>('All');
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredFreelancers = useMemo(() => {
    return featuredFreelancers.filter((f) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.skill.toLowerCase().includes(q) ||
        (f.bio && f.bio.toLowerCase().includes(q)) ||
        (f.skillsList && f.skillsList.some(s => s.toLowerCase().includes(q)));

      const matchesStatus = 
        selectedStatus === 'All'
          ? true
          : selectedStatus === 'following'
          ? followingFreelancerIds.includes(f.id)
          : f.hiring_status === selectedStatus;

      const matchesTrack = 
        selectedTrack === 'All' || 
        f.skill.toLowerCase().includes(selectedTrack.toLowerCase()) ||
        (f.skillsList && f.skillsList.some(s => s.toLowerCase().includes(selectedTrack.toLowerCase())));

      return matchesSearch && matchesStatus && matchesTrack;
    });
  }, [searchQuery, selectedStatus, selectedTrack, followingFreelancerIds]);

  const handleViewProfile = (freelancer: typeof featuredFreelancers[0]) => {
    setSelectedFreelancer(freelancer);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentScreen('FreelancerProfile');
  };

  return (
    <div id="freelancers-tab-screen" className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 relative bg-slate-50 dark:bg-[#0B132B] min-h-screen">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0B192C] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl sm:rounded-full shadow-xl font-medium text-[11px] sm:text-xs tracking-tight flex items-center justify-center gap-2 border border-slate-700 max-w-[90vw] sm:max-w-md text-center leading-snug break-words"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5 pt-1">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B192C] dark:text-white tracking-tight">
            Student Freelancers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Discover verified student talent ready for project collaboration.
          </p>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, skill, or department..."
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#111E38] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/40 shadow-xs placeholder:text-slate-400"
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
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              aria-label="Filter by skill track"
              className="px-3.5 py-2.5 bg-white dark:bg-[#111E38] rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/40 cursor-pointer shadow-xs"
            >
              <option value="All">All Skill Tracks</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Availability Status Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'All', label: 'All Talent' },
            { id: 'following', label: `Following (${followingFreelancerIds.length})` },
            { id: 'for_hire', label: 'Available for Hire' },
            { id: 'open_to_offers', label: 'Open to Offers' },
            { id: 'hiring', label: 'Actively Hiring' },
          ].map((statusTab) => {
            const isSelected = selectedStatus === statusTab.id;
            return (
              <button
                key={statusTab.id}
                onClick={() => setSelectedStatus(statusTab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#111E38] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {statusTab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Freelancers Grid */}
      {filteredFreelancers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFreelancers.map((freelancer) => {
            const isForHire = freelancer.hiring_status === 'for_hire';
            const isOpen = freelancer.hiring_status === 'open_to_offers';
            const isFollowing = isFollowingFreelancer(freelancer.id);

            return (
              <motion.div
                key={freelancer.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111E38] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all relative"
              >
                <div className="flex-1 flex flex-col">
                  {/* Top Card Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={freelancer.avatar}
                        alt={freelancer.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                      />
                      {freelancer.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#111E38] p-0.5 rounded-full shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-600 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        <span className={`w-2 h-2 rounded-full ${isForHire ? 'bg-emerald-500' : isOpen ? 'bg-amber-500' : 'bg-blue-600'}`} />
                        <span>{isForHire ? 'For Hire' : isOpen ? 'Open' : 'Hiring'}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{freelancer.rating}</span>
                        <span className="text-slate-400 font-normal">({freelancer.reviewsCount || 20})</span>
                      </div>
                    </div>
                  </div>

                  {/* Name and Degree */}
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug line-clamp-1">
                    {freelancer.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5 line-clamp-1">
                    {freelancer.skill}
                  </p>

                  {/* Skills tags */}
                  {freelancer.skillsList && freelancer.skillsList.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {freelancer.skillsList.slice(0, 2).map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
                        >
                          {sk}
                        </span>
                      ))}
                      {freelancer.skillsList.length > 2 && (
                        <span className="text-[10px] text-slate-400 font-semibold self-center">
                          +{freelancer.skillsList.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rate</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      {freelancer.hourlyRate || '₱400/hr'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Follow button */}
                    <button
                      onClick={() => {
                        const nextState = toggleFollowFreelancer(freelancer.id);
                        showToast(nextState ? `Now following ${freelancer.name}` : `Unfollowed ${freelancer.name}`);
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isFollowing
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-blue-600'
                      }`}
                      title={isFollowing ? `Following ${freelancer.name}` : `Follow ${freelancer.name}`}
                    >
                      {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => requestCollaborate(freelancer)}
                      className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 text-blue-600 hover:text-white dark:text-blue-400 dark:hover:text-white border border-blue-200 dark:border-blue-900/60 transition-colors cursor-pointer"
                      title={`Collaborate with ${freelancer.name}`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                    <button
                      onClick={() => handleViewProfile(freelancer)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 bg-white dark:bg-[#111E38] rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-sm text-slate-800 dark:text-white">
            No student freelancers found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            We couldn't find any student creators matching "{searchQuery}". Try searching another skill or resetting your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('All');
              setSelectedTrack('All');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
