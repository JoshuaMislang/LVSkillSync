import { useAppContext } from '../AppContext';
import { featuredFreelancers } from '../data';
import { 
  Settings, LogOut, ChevronRight, Star, Briefcase, Users, MessageCircle, 
  Calculator, HelpCircle, CheckCircle2, Edit3, ShieldCheck, FileText, 
  UploadCloud, Download, Eye, Trash2, X, AlertCircle, Sparkles, Clock, 
  UserCheck, ArrowUpRight, Camera, UserMinus, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';
import { HiringStatus } from '../types';
import { resizeImageToAvatar } from '../utils/imageUtils';

export default function Profile() {
  const { 
    setCurrentScreen, 
    setCurrentTab,
    userProfile, 
    setUserProfile, 
    authenticatedUser, 
    logout, 
    requestSignOut,
    updateHiringStatus,
    uploadResume,
    deleteResume,
    updateProfileDetails,
    followingFreelancerIds,
    toggleFollowFreelancer,
    setSelectedFreelancer,
    ensureChatThread,
    setSelectedChat,
    myPostedJobs,
    setRequestedJobsTab,
  } = useAppContext();

  const [isEditing, setIsEditing] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editSkill, setEditSkill] = useState(userProfile.skill || '');
  const [editAvatar, setEditAvatar] = useState<string>(userProfile.avatar || 'https://i.pravatar.cc/150?u=u1');
  const [editHiringStatus, setEditHiringStatus] = useState<HiringStatus>(userProfile.hiring_status || 'for_hire');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  // Close status dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setIsStatusMenuOpen(false);
      }
    }
    if (isStatusMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusMenuOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const displayName = authenticatedUser 
    ? `${authenticatedUser.first_name} ${authenticatedUser.last_name}`
    : userProfile.name;

  const displayEmail = authenticatedUser
    ? authenticatedUser.google_account
    : userProfile.email;

  const currentStatus: HiringStatus = (authenticatedUser?.hiring_status as HiringStatus) || userProfile.hiring_status || 'for_hire';

  // Hiring status styling and descriptors
  const statusConfig: Record<HiringStatus, {
    label: string;
    shortLabel: string;
    description: string;
    dotColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    accentGlow: string;
  }> = {
    for_hire: {
      label: 'Available for Hire',
      shortLabel: 'For Hire',
      description: 'Available for freelance gigs and projects',
      dotColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      badgeBorder: 'border-emerald-200 dark:border-emerald-800/70',
      accentGlow: 'ring-emerald-400/30',
    },
    hiring: {
      label: 'Actively Hiring',
      shortLabel: 'Hiring',
      description: 'Looking to hire student talent',
      dotColor: 'bg-blue-600',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/50',
      badgeText: 'text-blue-700 dark:text-blue-300',
      badgeBorder: 'border-blue-200 dark:border-blue-800/70',
      accentGlow: 'ring-blue-400/30',
    },
    open_to_offers: {
      label: 'Open to Offers',
      shortLabel: 'Open to Offers',
      description: 'Open to select opportunities',
      dotColor: 'bg-amber-500',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
      badgeText: 'text-amber-800 dark:text-amber-300',
      badgeBorder: 'border-amber-200 dark:border-amber-800/70',
      accentGlow: 'ring-amber-400/30',
    },
    not_available: {
      label: 'Not Available / Busy',
      shortLabel: 'Busy',
      description: 'Currently unavailable',
      dotColor: 'bg-slate-400',
      badgeBg: 'bg-slate-100 dark:bg-slate-800',
      badgeText: 'text-slate-700 dark:text-slate-300',
      badgeBorder: 'border-slate-200 dark:border-slate-700',
      accentGlow: 'ring-slate-400/20',
    },
  };

  const activeStatusMeta = statusConfig[currentStatus] || statusConfig.for_hire;

  // Handle switching status directly
  const handleSelectStatus = async (status: HiringStatus) => {
    setIsStatusMenuOpen(false);
    await updateHiringStatus(status);
    showToast(`Hiring status updated to: ${statusConfig[status].label}`);
  };

  // Process File Upload (PDF, DOCX, TXT)
  const processResumeFile = (file: File) => {
    if (!file) return;

    // Check size limit (max 10MB)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showToast('File exceeds 10MB limit. Please upload a smaller resume.');
      return;
    }

    setIsUploading(true);
    const formattedSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      await uploadResume({
        name: file.name,
        size: formattedSize,
        data: dataUri,
      });
      setIsUploading(false);
      showToast(`Resume "${file.name}" uploaded successfully!`);
    };
    reader.onerror = () => {
      setIsUploading(false);
      showToast('Failed to read resume file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processResumeFile(e.target.files[0]);
    }
  };

  const handleAvatarFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressed = await resizeImageToAvatar(file, 256);
        setEditAvatar(compressed);
        showToast('New photo chosen! Click "Save Changes" to apply.');
      } catch {
        showToast('Failed to process image file. Please try another photo.');
      }
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processResumeFile(e.dataTransfer.files[0]);
    }
  };

  // Load sample student CV for testing according to currently logged in profile
  const handleLoadSampleResume = async () => {
    const activeName = (authenticatedUser 
      ? `${authenticatedUser.first_name} ${authenticatedUser.last_name}`
      : userProfile.name).trim();
    const formattedName = activeName.replace(/\s+/g, '_') || 'Student';
    const sample = {
      name: `${formattedName}_LaVerdad_Student_CV.pdf`,
      size: '240 KB',
      data: 'data:application/pdf;base64,JVBERi0xLjQKJUZpbGUgY29udGVudHMgZm9yIExWIFNraWxsU3luYyBTdHVkZW50IFJlc3VtZQ==',
    };
    await uploadResume(sample);
    showToast(`Loaded verified sample resume for ${activeName}!`);
  };

  // Download Resume handler
  const handleDownloadResume = () => {
    if (!userProfile.resume) return;
    const a = document.createElement('a');
    a.href = userProfile.resume.data || '#';
    a.download = userProfile.resume.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloading ${userProfile.resume.name}...`);
  };

  // Delete Resume handler
  const handleDeleteResume = async () => {
    await deleteResume();
    setIsResumePreviewOpen(false);
    showToast('Resume removed from profile.');
  };

  return (
    <div id="profile-screen" className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 min-h-screen bg-slate-50 dark:bg-[#0B132B]">
      {/* Toast Alert */}
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

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B192C]/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white dark:bg-[#111E38] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-heading font-extrabold text-lg text-[#0B192C] dark:text-white">
                  Edit Student Profile
                </h2>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Update how your identity, skill track, and hiring availability appear to clients.
              </p>
              
              <div className="space-y-4 mb-5">
                {/* Profile Photo Customization */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-slate-50 dark:bg-[#0B132B] rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="relative group flex-shrink-0">
                      <img 
                        src={editAvatar} 
                        alt="Profile preview" 
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-600/40 shadow-sm bg-slate-200 dark:bg-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Upload new photo"
                      >
                        <Camera className="w-5 h-5 mb-0.5" />
                        <span className="text-[9px] font-bold">Change</span>
                      </button>
                    </div>

                    <div className="flex-1 w-full space-y-2 text-center sm:text-left min-w-0">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <button
                          type="button"
                          id="profile-upload-photo-btn"
                          onClick={() => avatarInputRef.current?.click()}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                        </button>

                        {editAvatar !== 'https://i.pravatar.cc/150?u=u1' && (
                          <button
                            type="button"
                            onClick={() => setEditAvatar('https://i.pravatar.cc/150?u=u1')}
                            className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          >
                            Reset to Default
                          </button>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Or select a student avatar:
                        </span>
                        <div className="flex items-center justify-center sm:justify-start gap-1.5">
                          {[
                            { label: 'Scholar', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
                            { label: 'Designer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
                            { label: 'Developer', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
                            { label: 'Creative', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setEditAvatar(preset.url)}
                              className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all ${
                                editAvatar === preset.url ? 'border-blue-600 scale-105 ring-2 ring-blue-300 dark:ring-blue-800' : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                              title={preset.label}
                            >
                              <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hidden avatar file input */}
                  <input 
                    type="file" 
                    ref={avatarInputRef} 
                    onChange={handleAvatarFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Primary Skill / Track
                  </label>
                  <input 
                    type="text" 
                    value={editSkill}
                    onChange={(e) => setEditSkill(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-xs text-slate-900 dark:text-white outline-none"
                    placeholder="e.g. UI/UX Designer & Web Developer"
                  />
                </div>

                {/* Hiring Status in Edit Modal */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Hiring & Availability Status
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Object.keys(statusConfig) as HiringStatus[]).map((statusKey) => {
                      const opt = statusConfig[statusKey];
                      const isSelected = editHiringStatus === statusKey;
                      return (
                        <button
                          key={statusKey}
                          type="button"
                          onClick={() => setEditHiringStatus(statusKey)}
                          className={`p-2.5 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                            isSelected 
                              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-600' 
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B132B] hover:border-slate-300'
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0 ${opt.dotColor}`} />
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                              {opt.label}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {opt.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2.5">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  id="profile-save-btn"
                  onClick={async () => {
                    await updateProfileDetails({
                      name: editName,
                      skill: editSkill,
                      hiring_status: editHiringStatus,
                      avatar_url: editAvatar,
                    });
                    setIsEditing(false);
                    showToast('Student profile details & photo saved!');
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Preview Modal */}
      <AnimatePresence>
        {isResumePreviewOpen && userProfile.resume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B192C]/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white dark:bg-[#111E38] rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0B132B]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                      {userProfile.resume.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {userProfile.resume.size} • Uploaded {userProfile.resume.updatedAt}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsResumePreviewOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Resume Preview Viewer */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-100/50 dark:bg-[#0B132B]/30">
                {/* Styled CV Card Layout */}
                <div className="bg-white dark:bg-[#0B132B] p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 font-sans space-y-6">
                  {/* Header of Resume */}
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-blue-600 dark:text-blue-400 font-bold">
                      Verified Student Curriculum Vitae
                    </span>
                    <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
                      {displayName}
                    </h1>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {userProfile.skill || 'Student Freelancer & Creator'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {displayEmail} • La Verdad Christian College • 0% Commission Platform
                    </p>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Professional Summary
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Passionate and goal-driven student practitioner at La Verdad Christian College with hands-on experience delivering freelance client deliverables, UI/UX wireframes, digital assets, and full-stack software solutions.
                    </p>
                  </div>

                  {/* Academic Background */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Education & Institution
                    </h4>
                    <div className="bg-slate-50 dark:bg-[#111E38] p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        La Verdad Christian College
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Academic Program: Information Technology & Computing Track
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Active Student Status
                      </span>
                    </div>
                  </div>

                  {/* Verified Skills */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Core Competencies & Tools
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['UI/UX Design', 'Figma', 'React & TypeScript', 'Tailwind CSS', 'Next.js', 'Graphic Assets', 'Client Milestone Delivery'].map((s) => (
                        <span key={s} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-medium rounded-lg">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Verification Seal */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      LVSkillSync Verified Credentials
                    </span>
                    <span className="font-mono text-[10px]">
                      REF-ID: {authenticatedUser?.user_id || 'LV-2026-STU'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer with Actions */}
              <div className="p-4 bg-white dark:bg-[#111E38] border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2.5 justify-between items-center">
                <button
                  onClick={handleDeleteResume}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Resume</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsResumePreviewOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Replace File
                  </button>
                  <button
                    onClick={handleDownloadResume}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CV</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Following Creators Modal */}
      <AnimatePresence>
        {isFollowingModalOpen && (
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
              className="bg-white dark:bg-[#111E38] rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0B132B]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                      Following Creators ({followingFreelancerIds.length})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Students you follow on La Verdad SkillSync
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFollowingModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Creators List */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-slate-50/40 dark:bg-[#0B132B]/30">
                {(() => {
                  const followedList = featuredFreelancers.filter(f => followingFreelancerIds.includes(f.id));

                  if (followedList.length === 0) {
                    return (
                      <div className="py-10 px-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 mx-auto flex items-center justify-center mb-3">
                          <Users className="w-6 h-6" />
                        </div>
                        <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-1">
                          Not following any creators yet
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-4 leading-relaxed">
                          Follow campus peers and top student creators to stay updated on their portfolios and availability.
                        </p>
                        <button
                          onClick={() => {
                            setIsFollowingModalOpen(false);
                            setCurrentTab('Freelancers');
                            setCurrentScreen('Main');
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Explore Student Freelancers
                        </button>
                      </div>
                    );
                  }

                  return followedList.map((f) => (
                    <div
                      key={f.id}
                      className="p-3.5 bg-white dark:bg-[#111E38] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-200 dark:hover:border-purple-900 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={f.avatar}
                            alt={f.name}
                            className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#111E38]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading font-bold text-xs text-slate-900 dark:text-white truncate">
                              {f.name}
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          </div>
                          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate">
                            {f.skill}
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                            <span>{f.rating} ★</span>
                            <span>•</span>
                            <span>{f.hourlyRate || '₱400/hr'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const thread = {
                              id: 'm_' + f.id,
                              userId: f.id,
                              name: f.name,
                              avatar: f.avatar,
                              lastMessage: 'Direct conversation',
                              timestamp: 'Just now',
                              unread: false,
                            };
                            ensureChatThread(thread);
                            setSelectedChat(thread);
                            setIsFollowingModalOpen(false);
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                            setCurrentScreen('Chat');
                          }}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs transition-colors cursor-pointer"
                          title="Message creator"
                        >
                          <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFreelancer(f);
                            setIsFollowingModalOpen(false);
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                            setCurrentScreen('FreelancerProfile');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>Profile</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            toggleFollowFreelancer(f.id);
                            showToast(`Unfollowed ${f.name}`);
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 hover:border-rose-200 text-slate-500 text-xs font-semibold transition-colors cursor-pointer"
                          title="Unfollow"
                        >
                          Unfollow
                        </button>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111E38] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsFollowingModalOpen(false);
                    setCurrentTab('Freelancers');
                    setCurrentScreen('Main');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Browse All in Freelancers Directory</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-5">
        {/* Screen Header */}
        <div className="flex justify-between items-start pt-1">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B192C] dark:text-white tracking-tight">
              My Profile
            </h1>
          </div>
          <button 
            id="profile-settings-btn"
            onClick={() => setCurrentScreen('Settings')}
            className="lg:hidden p-2.5 bg-white dark:bg-[#111E38] rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-blue-600" />
          </button>
        </div>

        {/* Profile Card & Info */}
        <div className="bg-white dark:bg-[#111E38] rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 relative">
          <div className="relative flex-shrink-0">
            <img 
              src={userProfile.avatar || authenticatedUser?.avatar_url || "https://i.pravatar.cc/150?u=u1"} 
              alt={userProfile.name} 
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100 dark:ring-slate-700 shadow-md bg-slate-100 dark:bg-slate-800" 
            />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 id="profile-display-name" className="font-heading font-extrabold text-xl text-[#0B192C] dark:text-white leading-tight">
                  {displayName}
                </h2>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                  {authenticatedUser?.skill || userProfile.skill}
                </p>
              </div>
              <button 
                id="profile-edit-btn"
                onClick={() => {
                  setEditName(displayName);
                  setEditSkill(authenticatedUser?.skill || userProfile.skill || '');
                  setEditHiringStatus(currentStatus);
                  setEditAvatar(userProfile.avatar || authenticatedUser?.avatar_url || 'https://i.pravatar.cc/150?u=u1');
                  setIsEditing(true);
                }} 
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 self-center sm:self-start"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <p id="profile-display-email" className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-3">
              {displayEmail} • La Verdad Christian College
            </p>

            {/* Verified Student Indicator */}
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Student</span>
            </div>

            {/* Prominent Hiring / Availability Status Selector */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Availability:
                </span>
                
                {/* Status Toggle Dropdown / Selector Button */}
                <div className="relative" ref={statusMenuRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsStatusMenuOpen((prev) => !prev);
                    }}
                    id="profile-hiring-status-btn"
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm transition-all cursor-pointer ${activeStatusMeta.badgeBg} ${activeStatusMeta.badgeText} ${activeStatusMeta.badgeBorder} hover:brightness-95 active:scale-95`}
                  >
                    <span className={`w-2 h-2 rounded-full ${activeStatusMeta.dotColor} animate-pulse`} />
                    <span>{activeStatusMeta.label}</span>
                    <span className={`text-[10px] opacity-70 transition-transform inline-block ${isStatusMenuOpen ? 'rotate-180' : ''}`}>▾</span>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isStatusMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 sm:left-auto top-full mt-2 z-50 w-72 bg-white dark:bg-[#111E38] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 space-y-1 ring-1 ring-black/10 dark:ring-white/10"
                      >
                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span>Set Your Availability</span>
                          <span className="text-[9px] font-normal text-emerald-600 dark:text-emerald-400">Live sync</span>
                        </div>
                        {(Object.keys(statusConfig) as HiringStatus[]).map((statusKey) => {
                          const item = statusConfig[statusKey];
                          const isCurrent = currentStatus === statusKey;
                          return (
                            <button
                              key={statusKey}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectStatus(statusKey);
                              }}
                              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 text-xs cursor-pointer ${
                                isCurrent 
                                  ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold ring-1 ring-blue-300 dark:ring-blue-700' 
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${item.dotColor} ring-2 ring-white dark:ring-slate-900`} />
                              <div className="flex-1 min-w-0">
                                <div className="leading-tight flex items-center justify-between">
                                  <span>{item.label}</span>
                                  {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                                  {item.description}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <span className="text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-right hidden sm:inline">
                {activeStatusMeta.description}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid (4 columns on tablet & desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-[#111E38] p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-[#0B192C] dark:text-white block leading-tight">
                {userProfile.completedProjects}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Completed Gigs</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111E38] p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-[#0B192C] dark:text-white block leading-tight">
                {userProfile.rating}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Client Rating</span>
            </div>
          </div>

          <button 
            type="button"
            id="profile-following-btn"
            onClick={() => setIsFollowingModalOpen(true)}
            className="bg-white dark:bg-[#111E38] p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 hover:border-purple-300 dark:hover:border-purple-700 transition-all text-left cursor-pointer group active:scale-[0.98]"
            title="View followed student creators"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-heading font-extrabold text-lg text-[#0B192C] dark:text-white block leading-tight">
                  {followingFreelancerIds.length}
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Following</span>
            </div>
          </button>

          <button
            type="button"
            id="profile-gigs-posted-btn"
            onClick={() => {
              setRequestedJobsTab('MyPostings');
              setCurrentTab('Jobs');
              setCurrentScreen('Main');
            }}
            className="bg-white dark:bg-[#111E38] p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left cursor-pointer group active:scale-[0.98]"
            title="View my posted opportunities"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-heading font-extrabold text-lg text-[#0B192C] dark:text-white block leading-tight">
                  {myPostedJobs.length}
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                  Manage →
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Gigs Posted</span>
            </div>
          </button>
        </div>

        {/* RESUME & CV UPLOAD SECTION */}
        <div id="profile-resume-section" className="bg-white dark:bg-[#111E38] rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#0B192C] dark:text-white leading-tight">
                  Resume & CV
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload your CV to attach with gig proposals
                </p>
              </div>
            </div>

            {userProfile.resume && (
              <span className="self-start sm:self-center inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Active Resume Attached
              </span>
            )}
          </div>

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInputChange} 
            accept=".pdf,.doc,.docx,.txt" 
            className="hidden" 
          />

          {userProfile.resume ? (
            /* UPLOADED RESUME CARD */
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#0B132B]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                {/* Red PDF / Document Icon Badge */}
                <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex flex-col items-center justify-center flex-shrink-0 text-rose-600 dark:text-rose-400">
                  <FileText className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider font-mono">PDF</span>
                </div>
                
                <div className="min-w-0">
                  <h4 className="font-heading font-bold text-sm text-[#0B192C] dark:text-white truncate">
                    {userProfile.resume.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {userProfile.resume.size}
                    </span>
                    <span>•</span>
                    <span>Updated {userProfile.resume.updatedAt}</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Auto-attached to proposals
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setIsResumePreviewOpen(true)}
                  className="px-3 py-1.5 bg-white dark:bg-[#111E38] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={handleDownloadResume}
                  className="px-3 py-1.5 bg-white dark:bg-[#111E38] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                >
                  Replace
                </button>

                <button
                  id="profile-remove-resume-btn"
                  onClick={handleDeleteResume}
                  className="px-3 py-1.5 border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Remove student resume"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            /* UPLOAD DROPZONE */
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                isDragging 
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 scale-[1.01]' 
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50/50 dark:bg-[#0B132B]/40 hover:bg-slate-50 dark:hover:bg-[#0B132B]/70'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#0B192C] dark:text-white mb-1">
                {isUploading ? 'Uploading Resume...' : 'Drop your resume here or click to browse'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-3">
                Supported formats: PDF, DOCX, or TXT (up to 10MB)
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  Browse Computer Files
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSampleResume();
                  }}
                  className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Load Sample Student CV</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feature Actions & Tools */}
        <div className="space-y-3">
          {/* Verified Student Credentials Card */}
          <div className="w-full bg-gradient-to-r from-blue-50 via-indigo-50/70 to-slate-50 dark:from-[#0B192C] dark:via-[#112340] dark:to-[#1E3E62] p-4 rounded-2xl shadow-sm flex items-center justify-between text-slate-800 dark:text-white border border-blue-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <span className="font-heading font-bold text-sm block leading-tight text-slate-900 dark:text-white">
                  Verified Student Badge
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  Academic credentials verified • LVCC IT Track
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>

          {/* Client & Hirer Portal Card */}
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setRequestedJobsTab('MyPostings');
              setCurrentTab('Jobs');
              setCurrentScreen('Main');
            }}
            id="profile-hirer-hub-btn"
            className="w-full bg-white dark:bg-[#111E38] p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-between hover:border-blue-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-heading font-semibold text-sm text-slate-900 dark:text-white block">
                  Client & Hirer Hub
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Post gigs and manage your {myPostedJobs.length} client postings
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
                + Post a Gig
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen('Calculator')}
            id="profile-calculator-btn"
            className="w-full bg-white dark:bg-[#111E38] p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-between hover:border-blue-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-heading font-semibold text-sm text-slate-900 dark:text-white block">
                  Earnings Calculator
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Calculate take-home pay and hourly rates
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => showToast('Student Support Help Desk: help@lvskillsync.edu')}
            className="w-full bg-white dark:bg-[#111E38] p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-between hover:border-blue-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-heading font-semibold text-sm text-slate-900 dark:text-white block">
                  Help & Safety Guide
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Milestone escrow, contracts, and FAQs
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
