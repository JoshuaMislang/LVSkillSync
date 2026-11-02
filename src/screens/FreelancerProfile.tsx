import { useAppContext } from '../AppContext';
import { 
  ArrowLeft, Star, Briefcase, Users, MessageCircle, 
  CheckCircle2, ShieldCheck, Sparkles, Clock, Share2, 
  ExternalLink, Award, GraduationCap, MapPin, Mail,
  UserPlus, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { featuredFreelancers } from '../data';
import { HiringStatus, MessageThread } from '../types';

export default function FreelancerProfile() {
  const { 
    selectedFreelancer, 
    setCurrentScreen, 
    setCurrentTab,
    requestCollaborate,
    ensureChatThread,
    setSelectedChat,
    messageThreads,
    goBack,
    followingFreelancerIds,
    toggleFollowFreelancer,
    isFollowingFreelancer,
  } = useAppContext();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Instantly reset window scroll position to the top upon opening any student profile
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fallback to first freelancer if none selected
  const freelancer = selectedFreelancer || featuredFreelancers[0];

  const statusConfig: Record<HiringStatus, {
    label: string;
    shortLabel: string;
    dotColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  }> = {
    for_hire: {
      label: 'Available for Hire',
      shortLabel: 'For Hire',
      dotColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      badgeBorder: 'border-emerald-200 dark:border-emerald-800/70',
    },
    hiring: {
      label: 'Actively Hiring',
      shortLabel: 'Hiring',
      dotColor: 'bg-blue-600',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/50',
      badgeText: 'text-blue-700 dark:text-blue-300',
      badgeBorder: 'border-blue-200 dark:border-blue-800/70',
    },
    open_to_offers: {
      label: 'Open to Offers',
      shortLabel: 'Open to Offers',
      dotColor: 'bg-amber-500',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
      badgeText: 'text-amber-800 dark:text-amber-300',
      badgeBorder: 'border-amber-200 dark:border-amber-800/70',
    },
    not_available: {
      label: 'Not Available / Busy',
      shortLabel: 'Busy',
      dotColor: 'bg-slate-400',
      badgeBg: 'bg-slate-100 dark:bg-slate-800',
      badgeText: 'text-slate-700 dark:text-slate-300',
      badgeBorder: 'border-slate-200 dark:border-slate-700',
    },
  };

  const statusInfo = statusConfig[freelancer.hiring_status || 'for_hire'];

  const handleStartMessage = () => {
    const threadId = `m_${freelancer.id}`;
    const existing = messageThreads.find(t => t.id === threadId || t.name.toLowerCase() === freelancer.name.toLowerCase());
    const thread: MessageThread = existing || {
      id: threadId,
      userId: freelancer.id,
      name: freelancer.name,
      avatar: freelancer.avatar,
      lastMessage: 'Direct conversation',
      timestamp: 'Just now',
      unread: false,
    };
    ensureChatThread(thread);
    setSelectedChat(thread);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentScreen('Chat');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied to clipboard!');
    } else {
      showToast(`Sharing ${freelancer.name}'s verified student portfolio.`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.99 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      id="freelancer-profile-screen" 
      className="min-h-screen bg-slate-50 dark:bg-[#0B132B] pb-28 lg:pb-16 text-slate-800 dark:text-slate-100"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-[#0B192C] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl sm:rounded-full shadow-xl font-medium text-[11px] sm:text-xs tracking-tight flex items-center justify-center gap-2 border border-slate-700 max-w-[90vw] sm:max-w-md text-center leading-snug break-words"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#0B132B]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={goBack}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Creator Profile
            </span>
          </div>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Share profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Hero Card */}
        <div className="relative bg-white dark:bg-[#111E38] rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          {/* Header Cover Banner */}
          <div className="h-32 sm:h-44 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 dark:from-blue-700 dark:via-indigo-700 dark:to-[#0B192C] relative p-4 sm:p-5 flex justify-between items-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>{freelancer.campus || 'La Verdad Christian College'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Student</span>
              </span>
            </div>
          </div>

          {/* Profile Body */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
            {/* Top row: Avatar overlapping banner on left, Rate on right */}
            <div className="flex justify-between items-end gap-2 sm:gap-3 -mt-10 sm:-mt-16 mb-4">
              <div className="relative flex-shrink-0">
                <img
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  className="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl object-cover ring-4 ring-white dark:ring-[#111E38] shadow-xl bg-white dark:bg-[#111E38]"
                />
                {freelancer.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#111E38] p-1 sm:p-1.5 rounded-full shadow-md">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 fill-blue-600 text-white" />
                  </div>
                )}
              </div>

              {/* Rate */}
              <div className="flex flex-col items-end gap-1 pb-1">
                <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {freelancer.hourlyRate || '₱400/hr'} <span className="text-[11px] sm:text-xs text-slate-400 font-normal">avg. rate</span>
                </span>
              </div>
            </div>

            {/* Creator Identity Details & Availability Badge */}
            <div className="mb-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-slate-900 dark:text-white leading-tight">
                  {freelancer.name}
                </h1>
                
                <span className={`inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full border shadow-2xs ${statusInfo.badgeBg} ${statusInfo.badgeText} ${statusInfo.badgeBorder}`}>
                  <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
                  <span className="sm:hidden">{statusInfo.shortLabel}</span>
                  <span className="hidden sm:inline">{statusInfo.label}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold">
                {freelancer.skill}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                {freelancer.degree || 'BS Information Technology • Student Freelancer'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            {(() => {
              const isFollowing = isFollowingFreelancer(freelancer.id);
              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <button
                    onClick={() => {
                      const nextState = toggleFollowFreelancer(freelancer.id);
                      showToast(nextState ? `Now following ${freelancer.name}!` : `Unfollowed ${freelancer.name}`);
                    }}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isFollowing
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-800 shadow-xs'
                        : 'bg-white dark:bg-[#111E38] text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => requestCollaborate(freelancer)}
                    className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Collaborate</span>
                  </button>

                  <button
                    onClick={handleStartMessage}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Send Message</span>
                  </button>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Stats Grid (Mirroring My Profile) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white dark:bg-[#111E38] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white block leading-tight">
                {freelancer.completedProjects || 28}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Gigs Done</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111E38] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white block leading-tight">
                {freelancer.rating} ★
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Client Rating</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111E38] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white block leading-tight">
                {freelancer.responseRate || '98%'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Response Rate</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111E38] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white block leading-tight">
                {(freelancer.followers || 42) + (isFollowingFreelancer(freelancer.id) ? 1 : 0)}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Followers</span>
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <div className="bg-white dark:bg-[#111E38] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="font-heading font-bold text-sm text-[#0B192C] dark:text-white uppercase tracking-wider">
            About
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {freelancer.bio || `${freelancer.name} is a dedicated student creator at La Verdad Christian College with verified skills in ${freelancer.skill}. Open to student internships, project milestones, and client contract gigs.`}
          </p>

          {/* Academic Verification Card */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0B132B]/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-heading font-bold text-xs text-slate-900 dark:text-white">
                Verified Campus Enrollment
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                La Verdad Christian College • Student Academic Status Active & Good Standing
              </p>
            </div>
          </div>
        </div>

        {/* Skills & Tools */}
        <div className="bg-white dark:bg-[#111E38] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="font-heading font-bold text-sm text-[#0B192C] dark:text-white uppercase tracking-wider">
            Skills & Specializations
          </h2>
          <div className="flex flex-wrap gap-2 pt-1">
            {(freelancer.skillsList || [freelancer.skill, 'Team Collaboration', 'Milestone Delivery', 'Git / Version Control']).map((sk, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/50"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Student Projects / Portfolio */}
        {freelancer.projects && freelancer.projects.length > 0 && (
          <div className="bg-white dark:bg-[#111E38] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-sm text-[#0B192C] dark:text-white uppercase tracking-wider">
                Featured Portfolio Projects ({freelancer.projects.length})
              </h2>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                Verified Deliveries
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {freelancer.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B132B]/50 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-950/80 px-2 py-0.5 rounded-full">
                        {proj.category}
                      </span>
                      {proj.clientRating && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{proj.clientRating}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Client Approved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client Reviews & Feedback */}
        {freelancer.reviews && freelancer.reviews.length > 0 && (
          <div className="bg-white dark:bg-[#111E38] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-sm text-[#0B192C] dark:text-white uppercase tracking-wider">
              Client Reviews & Recommendations
            </h2>

            <div className="space-y-3">
              {freelancer.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B132B]/50 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-heading font-bold text-xs text-slate-900 dark:text-white">
                        {rev.clientName}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {rev.clientCompany} • {rev.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Bar on Mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 p-3 bg-white/95 dark:bg-[#111E38]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 flex items-center gap-2">
        {(() => {
          const isFollowing = isFollowingFreelancer(freelancer.id);
          return (
            <button
              onClick={() => {
                const isNow = toggleFollowFreelancer(freelancer.id);
                showToast(isNow ? `Now following ${freelancer.name}` : `Unfollowed ${freelancer.name}`);
              }}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-center cursor-pointer ${
                isFollowing 
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title={isFollowing ? 'Following' : 'Follow'}
            >
              {isFollowing ? <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <UserPlus className="w-5 h-5" />}
            </button>
          );
        })()}

        <button
          onClick={handleStartMessage}
          className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          title="Direct message"
        >
          <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </button>

        <button
          onClick={() => requestCollaborate(freelancer)}
          className="flex-1 py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 transition-all cursor-pointer truncate"
        >
          <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <span className="truncate">Collaborate</span>
        </button>
      </div>
    </motion.div>
  );
}
