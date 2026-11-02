import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Screen, Tab, Job, MessageThread, Message, User, HiringStatus, UserResume, Notification, Freelancer, RegisteredAccount } from './types';
import { currentUser, getSampleResume, notifications as initialNotifications, messages as initialMessages, categories, jobs as initialJobs } from './data';

const baselineMessages: MessageThread[] = initialMessages.filter(im => im.id !== 'm4');

const baselineThreadMap: Record<string, Message[]> = {
  m1: [
    { id: '1', senderId: 'u1', text: 'Hi! I reviewed your project requirements and would love to collaborate. Here is my current availability.', timestamp: '10:30 AM' },
    { id: '2', senderId: 'c1', text: 'That looks great! Can we deploy tomorrow?', timestamp: '10:42 AM' }
  ],
  m2: [
    { id: '1', senderId: 'u1', text: 'Here are the initial branding mockups.', timestamp: 'Yesterday' },
    { id: '2', senderId: 'c2', text: 'I sent over the revised logo files.', timestamp: 'Yesterday' }
  ],
  m3: [
    { id: '1', senderId: 'u1', text: 'Interested in writing for DevInsider!', timestamp: 'Mon' },
    { id: '2', senderId: 'c3', text: 'When are you available for a quick call?', timestamp: 'Mon' }
  ],
  m5: [
    { id: '1', senderId: 'u1', text: 'Hello Marcus, I submitted our student proposal and resume for the FinTech Mobile redesign.', timestamp: 'Oct 14' },
    { id: '2', senderId: 'c5', text: 'We reviewed your student proposal for the mobile app redesign! Very impressed with your wireframe ideas.', timestamp: 'Oct 14' }
  ],
  m6: [
    { id: '1', senderId: 'c6', text: 'Good day! We are preparing our holiday organic marketing campaign.', timestamp: 'Oct 11' },
    { id: '2', senderId: 'c6', text: 'Do you offer bundle rates for carousel designs and brand illustrations?', timestamp: 'Oct 11' }
  ]
};

export function isDemoUser(accountKey?: string | null): boolean {
  if (!accountKey) return true;
  const norm = accountKey.toLowerCase().trim();
  return (
    norm === 'jhazzley.pore@student.laverdad.edu.ph' ||
    norm === 'joshua.student@lvskillsync.edu' ||
    norm === 'usr_jhazzley_lv1001' ||
    norm === 'usr_joshua_lv1002' ||
    norm === 'demo_default'
  );
}

export function loadAccountMessages(accountKey: string): { threads: MessageThread[]; threadMap: Record<string, Message[]> } {
  const isDemo = isDemoUser(accountKey);
  if (typeof window === 'undefined') {
    return {
      threads: isDemo ? baselineMessages : [],
      threadMap: isDemo ? baselineThreadMap : {}
    };
  }

  const savedThreadsStr = localStorage.getItem(`lvskillsync_messages_${accountKey}`);
  const savedThreadMapStr = localStorage.getItem(`lvskillsync_thread_messages_${accountKey}`);

  let threads: MessageThread[];
  let threadMap: Record<string, Message[]>;

  if (savedThreadsStr !== null) {
    try {
      threads = JSON.parse(savedThreadsStr);
    } catch {
      threads = isDemo ? baselineMessages : [];
    }
  } else {
    // For demo accounts, load baseline sample chats.
    // For newly created accounts, there are NO people/chats! (threads: [])
    threads = isDemo ? baselineMessages : [];
    localStorage.setItem(`lvskillsync_messages_${accountKey}`, JSON.stringify(threads));
  }

  if (savedThreadMapStr !== null) {
    try {
      threadMap = JSON.parse(savedThreadMapStr);
    } catch {
      threadMap = isDemo ? baselineThreadMap : {};
    }
  } else {
    threadMap = isDemo ? baselineThreadMap : {};
    localStorage.setItem(`lvskillsync_thread_messages_${accountKey}`, JSON.stringify(threadMap));
  }

  return { threads, threadMap };
}

function resolveUserResume(
  userFullName: string,
  resumeName?: string,
  resumeSize?: string,
  resumeData?: string,
  resumeUpdatedAt?: string
): UserResume | undefined {
  if (!resumeName || resumeName.trim() === '') {
    return undefined;
  }
  return {
    name: resumeName,
    size: resumeSize || 'Unknown size',
    data: resumeData || '',
    updatedAt: resumeUpdatedAt || 'Recently',
  };
}

export interface AuthenticatedUser {
  user_id: string;
  first_name: string;
  last_name: string;
  google_account: string;
  account_type?: 'Freelancer' | 'Client';
  skill?: string;
  bio?: string;
  campus?: string;
  avatar_url?: string;
  hiring_status?: HiringStatus;
  resume_name?: string;
  resume_size?: string;
  resume_data?: string;
  resume_updated_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface AppContextType {
  goBack: () => void;
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  requestedJobsTab: 'All' | 'Applied' | 'Saved' | 'MyPostings';
  setRequestedJobsTab: (tab: 'All' | 'Applied' | 'Saved' | 'MyPostings') => void;
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  selectedChat: MessageThread | null;
  setSelectedChat: (chat: MessageThread | null) => void;
  theme: 'Light' | 'Dark';
  setTheme: (theme: 'Light' | 'Dark') => void;
  notifications: 'On' | 'Off';
  setNotifications: (notifications: 'On' | 'Off') => void;
  userProfile: User;
  setUserProfile: (user: User) => void;
  updateHiringStatus: (status: HiringStatus) => Promise<{ success: boolean; message?: string; error?: string }>;
  uploadResume: (resume: { name: string; size: string; data: string }) => Promise<{ success: boolean; message?: string; error?: string }>;
  deleteResume: () => Promise<{ success: boolean; message?: string; error?: string }>;
  updateProfileDetails: (details: {
    first_name?: string;
    last_name?: string;
    name?: string;
    skill?: string;
    hiring_status?: HiringStatus;
    avatar_url?: string;
  }) => Promise<{ success: boolean; message?: string; error?: string }>;
  selectedFreelancer: Freelancer | null;
  setSelectedFreelancer: (freelancer: Freelancer | null) => void;
  popularCategories: string[];
  shufflePopularCategories: () => void;
  // Modals / Alerts
  isSignOutAlertOpen: boolean;
  requestSignOut: () => void;
  closeSignOutAlert: () => void;
  confirmSignOut: () => Promise<void>;
  collaborateTarget: Freelancer | null;
  requestCollaborate: (freelancer: Freelancer) => void;
  closeCollaborateAlert: () => void;
  confirmCollaborate: () => void;
  // Notifications / Alerts system
  hasUnreadAlerts: boolean;
  notificationsList: Notification[];
  markAllAlertsAsRead: () => void;
  markAlertAsRead: (id: string) => void;
  // Messages system
  messageThreads: MessageThread[];
  markThreadAsRead: (id: string) => void;
  threadMessages: Record<string, Message[]>;
  getMessages: (threadId: string) => Message[];
  sendMessage: (threadId: string, text: string) => void;
  ensureChatThread: (thread: MessageThread) => void;
  typingThreads: Record<string, boolean>;
  isThreadTyping: (threadId: string) => boolean;
  // Opportunities (Gigs) Applied & Saved System
  savedJobIds: string[];
  appliedJobIds: string[];
  toggleSaveJob: (jobId: string) => boolean;
  applyToJob: (jobId: string) => void;
  withdrawApplication: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  isJobApplied: (jobId: string) => boolean;
  // Following Freelancers system
  followingFreelancerIds: string[];
  toggleFollowFreelancer: (freelancerId: string) => boolean;
  isFollowingFreelancer: (freelancerId: string) => boolean;
  // Unified Jobs & Hirer Postings
  jobsList: Job[];
  myPostedJobs: Job[];
  postJob: (newJobData: {
    title: string;
    company?: string;
    budget: string;
    deadline: string;
    category: string;
    skills: string[];
    description: string;
    clientName?: string;
  }) => Job;
  deleteJob: (jobId: string) => void;
  // SQL Authenticated Account System
  authenticatedUser: AuthenticatedUser | null;
  isAuthLoading: boolean;
  authMessage: string | null;
  setAuthMessage: (msg: string | null) => void;
  login: (google_account: string, password: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  register: (formData: {
    first_name: string;
    last_name: string;
    google_account: string;
    password: string;
    account_type?: 'Freelancer' | 'Client';
  }) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  // Registered Accounts Directory
  registeredAccounts: RegisteredAccount[];
  saveRegisteredAccount: (account: RegisteredAccount) => void;
  deleteRegisteredAccount: (email: string) => void;
  switchAccountMessages: (accountKey: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, _setCurrentScreen] = useState<Screen>('Splash');
  const [currentTab, _setCurrentTab] = useState<Tab>('Home');
  const [requestedJobsTab, setRequestedJobsTab] = useState<'All' | 'Applied' | 'Saved' | 'MyPostings'>('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedChat, setSelectedChat] = useState<MessageThread | null>(null);
  const selectedChatRef = useRef(selectedChat);
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const currentScreenRef = useRef(currentScreen);
  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  const currentTabRef = useRef(currentTab);
  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  // Per-thread typing indicator state
  const [typingThreads, setTypingThreads] = useState<Record<string, boolean>>({});
  const typingTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const isThreadTyping = useCallback((threadId: string): boolean => {
    return Boolean(typingThreads[threadId]);
  }, [typingThreads]);

  useEffect(() => {
    return () => {
      const timeouts = typingTimeoutsRef.current;
      for (const id in timeouts) {
        if (timeouts[id]) {
          clearTimeout(timeouts[id]);
        }
      }
    };
  }, []);
  const [theme, _setTheme] = useState<'Light' | 'Dark'>(() => {
    if (typeof window !== 'undefined') {
      const explicit = localStorage.getItem('lvskillsync_user_explicit_theme');
      if (explicit === 'true') {
        const savedTheme = localStorage.getItem('lvskillsync_theme');
        if (savedTheme === 'Light' || savedTheme === 'Dark') {
          return savedTheme;
        }
      }
    }
    return 'Dark'; // Dark mode is the default theme
  });

  const setTheme = useCallback((t: 'Light' | 'Dark') => {
    _setTheme(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lvskillsync_user_explicit_theme', 'true');
      localStorage.setItem('lvskillsync_theme', t);
    }
  }, []);

  const [notifications, setNotifications] = useState<'On' | 'Off'>('On');
  const [userProfile, setUserProfile] = useState<User>(() => {
    const isDeleted = typeof window !== 'undefined' && localStorage.getItem('lvskillsync_resume_deleted') === 'true';
    const savedResume = typeof window !== 'undefined' ? localStorage.getItem('lvskillsync_saved_resume') : null;
    const savedAvatar = typeof window !== 'undefined' ? localStorage.getItem('lvskillsync_user_avatar') : null;

    const base: User = { ...currentUser };
    if (savedAvatar) {
      base.avatar = savedAvatar;
    }
    if (isDeleted) {
      delete base.resume;
    } else if (savedResume) {
      try {
        base.resume = JSON.parse(savedResume);
      } catch {
        // fallback
      }
    }
    return base;
  });

  // Alerts & Notifications state
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState<boolean>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lvskillsync_unread_alerts') : null;
    return saved !== null ? saved === 'true' : true;
  });
  const [notificationsList, setNotificationsList] = useState<Notification[]>(() => {
    const unreadSaved = typeof window !== 'undefined' ? localStorage.getItem('lvskillsync_unread_alerts') : null;
    const isAllRead = unreadSaved === 'false';
    return initialNotifications.map(n => ({ ...n, is_read: isAllRead }));
  });

  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);

  // Helper shuffle function for randomizing skill tracks
  const shuffleCategories = () => {
    const arr = [...categories];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const [popularCategories, setPopularCategories] = useState<string[]>(() => shuffleCategories());

  const shufflePopularCategories = useCallback(() => {
    setPopularCategories(shuffleCategories());
  }, []);

  // Alert modals state
  const [isSignOutAlertOpen, setIsSignOutAlertOpen] = useState(false);
  const [collaborateTarget, setCollaborateTarget] = useState<Freelancer | null>(null);
  const [applyTarget, setApplyTarget] = useState<Job | null>(null);

  const requestSignOut = useCallback(() => {
    setIsSignOutAlertOpen(true);
  }, []);

  const closeSignOutAlert = useCallback(() => {
    setIsSignOutAlertOpen(false);
  }, []);

  const requestApplyJob = useCallback((job: Job) => {
    setApplyTarget(job);
  }, []);

  const closeApplyAlert = useCallback(() => {
    setApplyTarget(null);
  }, []);

  const requestCollaborate = useCallback((freelancer: Freelancer) => {
    setCollaborateTarget(freelancer);
  }, []);

  const closeCollaborateAlert = useCallback(() => {
    setCollaborateTarget(null);
  }, []);

  // Active Account Key for Per-Account Isolation
  const activeAccountKeyRef = useRef<string>('demo_default');

  // Client Messages state
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(() => {
    const initial = loadAccountMessages(activeAccountKeyRef.current);
    return initial.threads;
  });

  const [threadMessages, setThreadMessages] = useState<Record<string, Message[]>>(() => {
    const initial = loadAccountMessages(activeAccountKeyRef.current);
    return initial.threadMap;
  });

  // Registered Accounts Directory State
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lvskillsync_registered_accounts');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });

  // Fetch registered accounts from server to sync with local list
  useEffect(() => {
    const fetchRegistered = async () => {
      try {
        const res = await fetch('/api/auth/registered-accounts');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.accounts)) {
            setRegisteredAccounts(prev => {
              const map = new Map<string, RegisteredAccount>();
              data.accounts.forEach((acc: any) => {
                map.set(acc.google_account.toLowerCase(), {
                  user_id: acc.user_id,
                  first_name: acc.first_name,
                  last_name: acc.last_name,
                  google_account: acc.google_account,
                  password: acc.password || 'studentpass123',
                  account_type: acc.account_type || 'Freelancer',
                  skill: acc.skill,
                  campus: acc.campus,
                  avatar_url: acc.avatar_url,
                  created_at: acc.created_at,
                });
              });
              // Keep passwords and any extra fields stored locally
              prev.forEach(p => {
                const existing = map.get(p.google_account.toLowerCase());
                if (existing) {
                  map.set(p.google_account.toLowerCase(), { ...existing, password: p.password || existing.password });
                } else {
                  map.set(p.google_account.toLowerCase(), p);
                }
              });
              const merged = Array.from(map.values()).sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              );
              localStorage.setItem('lvskillsync_registered_accounts', JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn('Failed to fetch registered accounts:', err);
      }
    };
    fetchRegistered();
  }, []);

  const saveRegisteredAccount = useCallback((account: RegisteredAccount) => {
    setRegisteredAccounts(prev => {
      const filtered = prev.filter(a => a.google_account.toLowerCase() !== account.google_account.toLowerCase());
      const updated = [account, ...filtered];
      localStorage.setItem('lvskillsync_registered_accounts', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteRegisteredAccount = useCallback((email: string) => {
    setRegisteredAccounts(prev => {
      const updated = prev.filter(a => a.google_account.toLowerCase() !== email.toLowerCase());
      localStorage.setItem('lvskillsync_registered_accounts', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const switchAccountMessages = useCallback((targetAccountKey: string) => {
    activeAccountKeyRef.current = targetAccountKey;
    const { threads, threadMap } = loadAccountMessages(targetAccountKey);
    setMessageThreads(threads);
    setThreadMessages(threadMap);
    setSelectedChat(null);
  }, []);

  // Opportunities (Gigs) Applied & Saved state
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lvskillsync_saved_job_ids');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return ['j2']; // Sample initial saved job (Brand Identity Design)
  });

  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lvskillsync_applied_job_ids');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return ['j1']; // Sample initial applied job (Senior React Developer)
  });

  const toggleSaveJob = useCallback((jobId: string) => {
    let nextState = false;
    setSavedJobIds(prev => {
      const exists = prev.includes(jobId);
      nextState = !exists;
      const updated = exists ? prev.filter(id => id !== jobId) : [...prev, jobId];
      localStorage.setItem('lvskillsync_saved_job_ids', JSON.stringify(updated));
      return updated;
    });
    return nextState;
  }, []);

  const applyToJob = useCallback((jobId: string) => {
    setAppliedJobIds(prev => {
      if (prev.includes(jobId)) return prev;
      const updated = [...prev, jobId];
      localStorage.setItem('lvskillsync_applied_job_ids', JSON.stringify(updated));
      return updated;
    });

    // Also push a live notification for student
    const newNotif: Notification = {
      id: 'notif_apply_' + Date.now(),
      title: 'Proposal Submitted Successfully',
      description: 'Your student proposal and credentials were submitted for client evaluation.',
      time: 'Just now',
      type: 'success',
      is_read: false,
    };
    setNotificationsList(prev => [newNotif, ...prev]);
    setHasUnreadAlerts(true);
    localStorage.setItem('lvskillsync_unread_alerts', 'true');
  }, []);

  const confirmApplyJob = useCallback(() => {
    if (!applyTarget) return;
    const job = applyTarget;
    applyToJob(job.id);
    setApplyTarget(null);
    return true;
  }, [applyTarget, applyToJob]);

  const withdrawApplication = useCallback((jobId: string) => {
    setAppliedJobIds(prev => {
      const updated = prev.filter(id => id !== jobId);
      localStorage.setItem('lvskillsync_applied_job_ids', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isJobSaved = useCallback((jobId: string) => {
    return savedJobIds.includes(jobId);
  }, [savedJobIds]);

  const isJobApplied = useCallback((jobId: string) => {
    return appliedJobIds.includes(jobId);
  }, [appliedJobIds]);

  // Following Freelancers State
  const [followingFreelancerIds, setFollowingFreelancerIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lvskillsync_following_freelancers');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return ['f1']; // Alice Chen followed by default
  });

  const toggleFollowFreelancer = useCallback((freelancerId: string) => {
    let nextState = false;
    setFollowingFreelancerIds(prev => {
      const exists = prev.includes(freelancerId);
      nextState = !exists;
      const updated = exists ? prev.filter(id => id !== freelancerId) : [...prev, freelancerId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('lvskillsync_following_freelancers', JSON.stringify(updated));
      }
      return updated;
    });
    return nextState;
  }, []);

  const isFollowingFreelancer = useCallback((freelancerId: string) => {
    return followingFreelancerIds.includes(freelancerId);
  }, [followingFreelancerIds]);

  // Unified Jobs / Hirer Opportunities State
  const [jobsList, setJobsList] = useState<Job[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lvskillsync_all_jobs');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {}
      }
    }
    return initialJobs;
  });

  const [history, setHistory] = useState<{ screen: Screen; tab: Tab }[]>([{ screen: 'Splash', tab: 'Home' }]);

  // SQL Authenticated Account System
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const postJob = useCallback((newJobData: {
    title: string;
    company?: string;
    budget: string;
    deadline: string;
    category: string;
    skills: string[];
    description: string;
    clientName?: string;
  }) => {
    const activeName = (authenticatedUser 
      ? `${authenticatedUser.first_name} ${authenticatedUser.last_name}`
      : userProfile.name).trim();

    const createdJob: Job = {
      id: 'job_user_' + Date.now(),
      title: newJobData.title.trim(),
      company: newJobData.company?.trim() || `${activeName} (Campus Hirer)`,
      budget: newJobData.budget.startsWith('₱') ? newJobData.budget : `₱${newJobData.budget}`,
      deadline: newJobData.deadline.trim() || 'Flexible / Milestone',
      category: newJobData.category || 'Programming',
      skills: newJobData.skills && newJobData.skills.length > 0 ? newJobData.skills : ['Project Delivery', 'Collaboration'],
      description: newJobData.description.trim(),
      clientName: newJobData.clientName || activeName,
      isMyPost: true,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setJobsList(prev => {
      const updated = [createdJob, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('lvskillsync_all_jobs', JSON.stringify(updated));
      }
      return updated;
    });

    // Send push notification
    const newNotif: Notification = {
      id: 'notif_job_' + Date.now(),
      title: 'Opportunity Posted Live',
      description: `Your gig "${createdJob.title}" is now visible to student talent.`,
      time: 'Just now',
      type: 'info',
      is_read: false,
    };
    setNotificationsList(prev => [newNotif, ...prev]);
    setHasUnreadAlerts(true);
    localStorage.setItem('lvskillsync_unread_alerts', 'true');

    return createdJob;
  }, [authenticatedUser, userProfile.name]);

  const deleteJob = useCallback((jobId: string) => {
    setJobsList(prev => {
      const updated = prev.filter(j => j.id !== jobId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lvskillsync_all_jobs', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const myPostedJobs = jobsList.filter(j => {
    const activeName = (authenticatedUser 
      ? `${authenticatedUser.first_name} ${authenticatedUser.last_name}`
      : userProfile.name).trim().toLowerCase();
    return j.isMyPost || j.clientName?.toLowerCase() === activeName;
  });

  // Helper to get auth header with token fallback
  const getAuthHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const storedToken = localStorage.getItem('lvskillsync_token');
    if (storedToken) {
      headers['Authorization'] = `Bearer ${storedToken}`;
    }
    return headers;
  }, []);

  // Fetch current authenticated user from SQL session
  const refreshUser = useCallback(async () => {
    try {
      setIsAuthLoading(true);
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setAuthenticatedUser(data.user);
          const fullName = `${data.user.first_name} ${data.user.last_name}`.trim();
          const localAvatar = typeof window !== 'undefined' ? localStorage.getItem('lvskillsync_user_avatar') : null;
          setUserProfile(prev => ({
            ...prev,
            name: fullName,
            email: data.user.google_account,
            skill: data.user.skill || prev.skill,
            avatar: data.user.avatar_url || localAvatar || prev.avatar,
            hiring_status: (data.user.hiring_status as HiringStatus) || prev.hiring_status || 'for_hire',
            resume: resolveUserResume(
              fullName,
              data.user.resume_name,
              data.user.resume_size,
              data.user.resume_data,
              data.user.resume_updated_at
            ),
          }));
          switchAccountMessages(data.user.google_account);
        }
      } else {
        setAuthenticatedUser(null);
        switchAccountMessages('demo_default');
      }
    } catch (err) {
      console.warn('Session refresh error:', err);
      setAuthenticatedUser(null);
      switchAccountMessages('demo_default');
    } finally {
      setIsAuthLoading(false);
    }
  }, [getAuthHeaders, switchAccountMessages]);

  // Initial session check on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Login handler
  const login = useCallback(async (google_account: string, password: string) => {
    try {
      setIsAuthLoading(true);
      setAuthMessage(null);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ google_account, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        const errMsg = data.error || 'Authentication failed.';
        setAuthMessage(errMsg);
        return { success: false, error: errMsg };
      }

      if (data.token) {
        localStorage.setItem('lvskillsync_token', data.token);
      }
      setAuthenticatedUser(data.user);
      const fullName = `${data.user.first_name} ${data.user.last_name}`.trim();
      setUserProfile(prev => ({
        ...prev,
        name: fullName,
        email: data.user.google_account,
        skill: data.user.skill || prev.skill,
        avatar: data.user.avatar_url || prev.avatar,
        hiring_status: (data.user.hiring_status as HiringStatus) || prev.hiring_status || 'for_hire',
        resume: resolveUserResume(
          fullName,
          data.user.resume_name,
          data.user.resume_size,
          data.user.resume_data,
          data.user.resume_updated_at
        ),
      }));

      // Switch message threads and chat logs to this specific account
      switchAccountMessages(data.user.google_account);

      const successMsg = data.message || `Welcome back, ${data.user.first_name}!`;
      setAuthMessage(successMsg);
      // Randomize popular skill tracks tags on each login
      shufflePopularCategories();
      return { success: true, message: successMsg };
    } catch (err: any) {
      const errMsg = err.message || 'Unable to connect to authentication server.';
      setAuthMessage(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsAuthLoading(false);
    }
  }, [shufflePopularCategories, switchAccountMessages]);

  // Register handler
  const register = useCallback(async (formData: {
    first_name: string;
    last_name: string;
    google_account: string;
    password: string;
    account_type?: 'Freelancer' | 'Client';
  }) => {
    try {
      setIsAuthLoading(true);
      setAuthMessage(null);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        const errMsg = data.error || 'Registration failed.';
        setAuthMessage(errMsg);
        return { success: false, error: errMsg };
      }

      if (data.token) {
        localStorage.setItem('lvskillsync_token', data.token);
      }
      setAuthenticatedUser(data.user);
      const fullName = `${data.user.first_name} ${data.user.last_name}`.trim();
      setUserProfile(prev => ({
        ...prev,
        name: fullName,
        email: data.user.google_account,
        skill: data.user.skill || prev.skill,
        avatar: data.user.avatar_url || prev.avatar,
        resume: undefined,
      }));

      // Store in registered accounts list
      const targetAccountKey = data.user.google_account.toLowerCase().trim();
      saveRegisteredAccount({
        user_id: data.user.user_id,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        google_account: data.user.google_account,
        password: formData.password,
        account_type: data.user.account_type || 'Freelancer',
        campus: data.user.campus,
        avatar_url: data.user.avatar_url,
        created_at: new Date().toISOString(),
      });

      // Newly created account: strictly NO people/chats on messages
      activeAccountKeyRef.current = targetAccountKey;
      setMessageThreads([]);
      setThreadMessages({});
      setSelectedChat(null);
      localStorage.setItem(`lvskillsync_messages_${targetAccountKey}`, JSON.stringify([]));
      localStorage.setItem(`lvskillsync_thread_messages_${targetAccountKey}`, JSON.stringify({}));

      const successMsg = data.message || `Account created successfully. Welcome, ${data.user.first_name}!`;
      setAuthMessage(successMsg);
      shufflePopularCategories();
      return { success: true, message: successMsg };
    } catch (err: any) {
      const errMsg = err.message || 'Unable to connect to registration server.';
      setAuthMessage(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsAuthLoading(false);
    }
  }, [shufflePopularCategories, saveRegisteredAccount]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      localStorage.removeItem('lvskillsync_token');
      localStorage.removeItem('lvskillsync_saved_resume');
      setAuthenticatedUser(null);
      setUserProfile(currentUser);
      switchAccountMessages('demo_default');
      _setCurrentScreen('Login');
      setAuthMessage('You have been signed out.');
    }
  }, [getAuthHeaders, switchAccountMessages]);

  const confirmSignOut = useCallback(async () => {
    setIsSignOutAlertOpen(false);
    await logout();
  }, [logout]);

  const confirmCollaborate = useCallback(() => {
    if (!collaborateTarget) return;
    const target = collaborateTarget;
    const threadId = `m_${target.id}`;
    const senderFirstName = authenticatedUser ? authenticatedUser.first_name : userProfile.name.split(' ')[0];
    const inviteText = `🤝 Project Collaboration Invitation: Hi ${target.name}! I checked out your verified student portfolio on LV SkillSync and would love to collaborate with you on upcoming freelance gigs.`;

    const initialCollabMsg: Message = {
      id: 'collab_inv_' + Date.now(),
      senderId: 'u1',
      text: inviteText,
      timestamp: 'Just now'
    };

    setMessageThreads(prev => {
      const existing = prev.find(t => t.id === threadId || t.name.toLowerCase() === target.name.toLowerCase());
      if (existing) {
        return prev.map(t => t.id === existing.id ? { ...t, lastMessage: inviteText, timestamp: 'Just now' } : t);
      }
      const newThread: MessageThread = {
        id: threadId,
        userId: target.id,
        name: target.name,
        avatar: target.avatar,
        lastMessage: inviteText,
        timestamp: 'Just now',
        unread: false,
      };
      const updated = [newThread, ...prev];
      const curKey = activeAccountKeyRef.current;
      localStorage.setItem(`lvskillsync_messages_${curKey}`, JSON.stringify(updated));
      localStorage.setItem('lvskillsync_messages', JSON.stringify(updated));
      return updated;
    });

    const threadObj: MessageThread = {
      id: threadId,
      userId: target.id,
      name: target.name,
      avatar: target.avatar,
      lastMessage: inviteText,
      timestamp: 'Just now',
      unread: false,
    };

    setThreadMessages(prev => {
      const currentMsgs = prev[threadId] || [];
      const updated = {
        ...prev,
        [threadId]: [...currentMsgs, initialCollabMsg]
      };
      const curKey = activeAccountKeyRef.current;
      localStorage.setItem(`lvskillsync_thread_messages_${curKey}`, JSON.stringify(updated));
      localStorage.setItem('lvskillsync_thread_messages', JSON.stringify(updated));
      return updated;
    });

    setSelectedChat(threadObj);
    setCollaborateTarget(null);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    _setCurrentScreen('Chat');

    // Fixed automatic reply from the collaborated freelancer with typing delay
    if (typingTimeoutsRef.current[threadId]) {
      clearTimeout(typingTimeoutsRef.current[threadId]);
    }
    setTypingThreads(prev => ({ ...prev, [threadId]: true }));

    const collabTimeout = setTimeout(() => {
      const autoReplyText = `Hi ${senderFirstName}! Thanks for sending the collaboration invite! 🚀 I'd love to team up on campus gigs and client projects. What kind of project do you have in mind?`;
      
      const replyMsg: Message = {
        id: 'collab_reply_' + Date.now(),
        senderId: target.id,
        text: autoReplyText,
        timestamp: 'Just now'
      };

      setThreadMessages(prev => {
        const currentMsgs = prev[threadId] || [];
        const updated = {
          ...prev,
          [threadId]: [...currentMsgs, replyMsg]
        };
        const curKey = activeAccountKeyRef.current;
        localStorage.setItem(`lvskillsync_thread_messages_${curKey}`, JSON.stringify(updated));
        localStorage.setItem('lvskillsync_thread_messages', JSON.stringify(updated));
        return updated;
      });

      setTypingThreads(prev => {
        const next = { ...prev };
        delete next[threadId];
        return next;
      });

      setMessageThreads(prev => {
        const updated = prev.map(t => {
          if (t.id === threadId || t.userId === target.id) {
            return {
              ...t,
              lastMessage: autoReplyText,
              timestamp: 'Just now',
              unread: selectedChatRef.current?.id !== threadId
            };
          }
          return t;
        });
        const curKey = activeAccountKeyRef.current;
        localStorage.setItem(`lvskillsync_messages_${curKey}`, JSON.stringify(updated));
        localStorage.setItem('lvskillsync_messages', JSON.stringify(updated));
        return updated;
      });

      delete typingTimeoutsRef.current[threadId];
    }, 1800);

    typingTimeoutsRef.current[threadId] = collabTimeout;
  }, [collaborateTarget, authenticatedUser, userProfile.name]);

  // Keep sample resume file name dynamically aligned with the currently logged-in profile ONLY IF sample resume exists
  useEffect(() => {
    if (authenticatedUser) {
      const activeName = `${authenticatedUser.first_name} ${authenticatedUser.last_name}`.trim();
      const expectedSampleName = `${activeName.replace(/\s+/g, '_')}_LaVerdad_Student_CV.pdf`;
      setUserProfile(prev => {
        // Crucial fix: ONLY update if a sample resume is currently present and non-deleted
        if (prev.resume && prev.resume.name.endsWith('_LaVerdad_Student_CV.pdf') && prev.resume.name !== expectedSampleName) {
          return {
            ...prev,
            name: activeName,
            email: authenticatedUser.google_account,
            resume: {
              name: expectedSampleName,
              size: prev.resume.size,
              data: prev.resume.data,
              updatedAt: prev.resume.updatedAt,
            },
          };
        }
        return prev;
      });
    }
  }, [authenticatedUser]);

  // Update Hiring / Availability Status
  const updateHiringStatus = useCallback(async (status: HiringStatus) => {
    setUserProfile(prev => ({ ...prev, hiring_status: status }));
    if (authenticatedUser) {
      setAuthenticatedUser(prev => prev ? ({ ...prev, hiring_status: status }) : null);
    }
    localStorage.setItem('lvskillsync_hiring_status', status);

    try {
      const res = await fetch('/api/auth/hiring-status', {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ hiring_status: status }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setAuthenticatedUser(data.user);
        }
        return { success: true, message: 'Availability status updated!' };
      }
      return { success: true, message: 'Status updated locally.' };
    } catch {
      return { success: true, message: 'Status updated.' };
    }
  }, [authenticatedUser, getAuthHeaders]);

  // Update Profile Details (Name, Skill, Avatar, Availability)
  const updateProfileDetails = useCallback(async (details: {
    first_name?: string;
    last_name?: string;
    name?: string;
    skill?: string;
    hiring_status?: HiringStatus;
    avatar_url?: string;
  }) => {
    if (details.avatar_url) {
      try {
        localStorage.setItem('lvskillsync_user_avatar', details.avatar_url);
      } catch (e) {
        console.warn('Could not store avatar in localStorage:', e);
      }
    }

    let parsedFirstName = details.first_name;
    let parsedLastName = details.last_name;
    if (!parsedFirstName && details.name) {
      const parts = details.name.trim().split(' ');
      parsedFirstName = parts[0] || '';
      parsedLastName = parts.slice(1).join(' ') || '';
    }

    setUserProfile(prev => {
      let resolvedName = prev.name;
      if (details.name) {
        resolvedName = details.name;
      } else if (details.first_name) {
        resolvedName = `${details.first_name} ${details.last_name || ''}`.trim();
      }
      return {
        ...prev,
        name: resolvedName,
        skill: details.skill !== undefined ? details.skill : prev.skill,
        avatar: details.avatar_url !== undefined ? details.avatar_url : prev.avatar,
        hiring_status: details.hiring_status !== undefined ? details.hiring_status : prev.hiring_status,
      };
    });

    if (authenticatedUser) {
      setAuthenticatedUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          first_name: parsedFirstName || prev.first_name,
          last_name: parsedLastName !== undefined ? parsedLastName : prev.last_name,
          skill: details.skill !== undefined ? details.skill : prev.skill,
          avatar_url: details.avatar_url !== undefined ? details.avatar_url : prev.avatar_url,
          hiring_status: details.hiring_status !== undefined ? details.hiring_status : prev.hiring_status,
        };
      });

      try {
        const res = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({
            first_name: parsedFirstName,
            last_name: parsedLastName,
            skill: details.skill,
            hiring_status: details.hiring_status,
            avatar_url: details.avatar_url,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setAuthenticatedUser(data.user);
          }
          return { success: true, message: 'Profile updated successfully!' };
        }
      } catch (err) {
        console.warn('Profile sync warning:', err);
      }
    }
    return { success: true, message: 'Profile updated successfully.' };
  }, [authenticatedUser, getAuthHeaders]);

  // Upload or Replace Student Resume
  const uploadResume = useCallback(async (resume: { name: string; size: string; data: string }) => {
    const updatedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newResume: UserResume = {
      name: resume.name,
      size: resume.size,
      data: resume.data,
      updatedAt,
    };

    localStorage.removeItem('lvskillsync_resume_deleted');
    setUserProfile(prev => ({ ...prev, resume: newResume }));
    localStorage.setItem('lvskillsync_saved_resume', JSON.stringify(newResume));

    try {
      const res = await fetch('/api/auth/resume', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(resume),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setAuthenticatedUser(data.user);
        }
        return { success: true, message: 'Resume uploaded successfully!' };
      }
      return { success: true, message: 'Resume saved to student profile!' };
    } catch {
      return { success: true, message: 'Resume saved to profile!' };
    }
  }, [getAuthHeaders]);

  // Delete / Remove Student Resume
  const deleteResume = useCallback(async () => {
    localStorage.setItem('lvskillsync_resume_deleted', 'true');
    localStorage.removeItem('lvskillsync_saved_resume');
    setUserProfile(prev => {
      const updated = { ...prev };
      delete updated.resume;
      return updated;
    });
    if (authenticatedUser) {
      setAuthenticatedUser(prev => prev ? ({
        ...prev,
        resume_name: undefined,
        resume_size: undefined,
        resume_data: undefined,
        resume_updated_at: undefined,
      }) : null);
    }

    try {
      const res = await fetch('/api/auth/resume', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setAuthenticatedUser(data.user);
        }
      }
      return { success: true, message: 'Resume removed.' };
    } catch {
      return { success: true, message: 'Resume removed.' };
    }
  }, [authenticatedUser, getAuthHeaders]);

  // Alerts actions
  const markAllAlertsAsRead = useCallback(() => {
    setHasUnreadAlerts(false);
    localStorage.setItem('lvskillsync_unread_alerts', 'false');
    setNotificationsList(prev => prev.map(n => ({ ...n, is_read: true })));
  }, []);

  const markAlertAsRead = useCallback((id: string) => {
    setNotificationsList(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, is_read: true } : n);
      if (!updated.some(n => !n.is_read)) {
        setHasUnreadAlerts(false);
        localStorage.setItem('lvskillsync_unread_alerts', 'false');
      }
      return updated;
    });
  }, []);

  // Message actions
  const markThreadAsRead = useCallback((id: string) => {
    setMessageThreads(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, unread: false } : t);
      const curKey = activeAccountKeyRef.current;
      localStorage.setItem(`lvskillsync_messages_${curKey}`, JSON.stringify(updated));
      localStorage.setItem('lvskillsync_messages', JSON.stringify(updated));
      return updated;
    });
    setSelectedChat(prev => prev && prev.id === id ? { ...prev, unread: false } : prev);
  }, []);

  const getMessages = useCallback((threadId: string): Message[] => {
    return threadMessages[threadId] || [
      { id: '1', senderId: 'u1', text: 'Hi! I would like to discuss the project details with you.', timestamp: 'Just now' }
    ];
  }, [threadMessages]);

  const sendMessage = useCallback((threadId: string, text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'u1',
      text,
      timestamp: timeStr
    };

    setThreadMessages(prev => {
      const currentMsgs = prev[threadId] || [];
      const updatedMsgs = [...currentMsgs, newMsg];
      const nextState = { ...prev, [threadId]: updatedMsgs };
      const curKey = activeAccountKeyRef.current;
      localStorage.setItem(`lvskillsync_thread_messages_${curKey}`, JSON.stringify(nextState));
      localStorage.setItem('lvskillsync_thread_messages', JSON.stringify(nextState));
      return nextState;
    });

    setMessageThreads(prev => {
      const updated = prev.map(t => t.id === threadId ? {
        ...t,
        lastMessage: text,
        timestamp: timeStr,
        unread: false
      } : t);
      const curKey = activeAccountKeyRef.current;
      localStorage.setItem(`lvskillsync_messages_${curKey}`, JSON.stringify(updated));
      localStorage.setItem('lvskillsync_messages', JSON.stringify(updated));
      return updated;
    });

    // Simulate client response in background (continues even if user leaves chat screen!)
    const responses = [
      `Thanks for sharing! Your student profile and skills for this project look exceptionally strong. Let's get started on the deliverables.`,
      `Received! We are reviewing student proposals for this gig right now. Are you available for a quick sync this week?`,
      `That sounds fantastic. Since student fees are 0% on this platform, we can allocate the full stipend directly to your account. Ready to begin?`,
      `Impressive background! I've marked your proposal as shortlisted. Please submit your milestone timeline whenever you're ready.`
    ];
    const randomReply = responses[Math.floor(Math.random() * responses.length)];

    // Clear any previous timer for this thread
    if (typingTimeoutsRef.current[threadId]) {
      clearTimeout(typingTimeoutsRef.current[threadId]);
    }
    // Set typing ONLY for this specific thread
    setTypingThreads(prev => ({ ...prev, [threadId]: true }));

    const replyTimeout = setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const clientMsg: Message = {
        id: (Date.now() + 10).toString(),
        senderId: threadId.startsWith('m') ? threadId.replace('m', 'c') : 'client_user',
        text: randomReply,
        timestamp: replyTime
      };

      setThreadMessages(prev => {
        const currentMsgs = prev[threadId] || [];
        const updatedMsgs = [...currentMsgs, clientMsg];
        const nextState = { ...prev, [threadId]: updatedMsgs };
        const curKey = activeAccountKeyRef.current;
        localStorage.setItem(`lvskillsync_thread_messages_${curKey}`, JSON.stringify(nextState));
        localStorage.setItem('lvskillsync_thread_messages', JSON.stringify(nextState));
        return nextState;
      });

      // Clear typing indicator for this thread
      setTypingThreads(prev => {
        const next = { ...prev };
        delete next[threadId];
        return next;
      });

      const isViewingThread = selectedChatRef.current?.id === threadId;

      setMessageThreads(prev => {
        const updated = prev.map(t => t.id === threadId ? {
          ...t,
          lastMessage: randomReply,
          timestamp: replyTime,
          unread: isViewingThread ? false : true
        } : t);
        const curKey = activeAccountKeyRef.current;
        localStorage.setItem(`lvskillsync_messages_${curKey}`, JSON.stringify(updated));
        localStorage.setItem('lvskillsync_messages', JSON.stringify(updated));
        return updated;
      });

      delete typingTimeoutsRef.current[threadId];
    }, 3200);

    typingTimeoutsRef.current[threadId] = replyTimeout;
  }, []);

  const ensureChatThread = useCallback((thread: MessageThread) => {
    setMessageThreads(prev => {
      if (prev.some(t => t.id === thread.id || t.name.toLowerCase() === thread.name.toLowerCase())) {
        return prev;
      }
      const updated = [thread, ...prev];
      const curKey = activeAccountKeyRef.current;
      localStorage.setItem(`lvskillsync_messages_${curKey}`, JSON.stringify(updated));
      localStorage.setItem('lvskillsync_messages', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setCurrentScreen = useCallback((screen: Screen) => {
    // Gracefully handle tab names if accidentally passed as screen
    const tabNames: Tab[] = ['Home', 'Jobs', 'Freelancers', 'Messages', 'Notifications', 'Profile'];
    if (tabNames.includes(screen as any)) {
      _setCurrentTab(screen as any);
      _setCurrentScreen('Main');
      setHistory(prev => [...prev, { screen: 'Main', tab: screen as any }]);
      return;
    }

    _setCurrentScreen(screen);
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (last && last.screen === screen) return prev;
      return [...prev, { screen, tab: last ? last.tab : 'Home' }];
    });
  }, []);

  const setCurrentTab = useCallback((tab: Tab) => {
    _setCurrentTab(tab);
    _setCurrentScreen('Main');
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (last && last.tab === tab && last.screen === 'Main') return prev;
      return [...prev, { screen: 'Main', tab }];
    });
  }, []);

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length > 1) {
        const current = prev[prev.length - 1];
        if (current.screen === 'Login' || current.screen === 'Splash') {
          import('@capacitor/dialog').then(({ Dialog }) => {
            Dialog.confirm({
              title: 'Exit App',
              message: 'Are you sure you want to exit?',
            }).then(({ value }) => {
              if (value) {
                import('@capacitor/app').then(({ App }) => App.exitApp());
              }
            });
          });
          return prev;
        }

        const newHistory = [...prev];
        newHistory.pop();
        const prevState = newHistory[newHistory.length - 1];

        if (prevState.screen === 'Splash' || prevState.screen === 'Login') {
          import('@capacitor/dialog').then(({ Dialog }) => {
            Dialog.confirm({
              title: 'Exit App',
              message: 'Are you sure you want to exit?',
            }).then(({ value }) => {
              if (value) {
                import('@capacitor/app').then(({ App }) => App.exitApp());
              }
            });
          });
          return prev;
        }

        setTimeout(() => {
          _setCurrentScreen(prevState.screen);
          _setCurrentTab(prevState.tab);
        }, 0);

        return newHistory;
      } else {
        import('@capacitor/dialog').then(({ Dialog }) => {
          Dialog.confirm({
            title: 'Exit App',
            message: 'Are you sure you want to exit?',
          }).then(({ value }) => {
            if (value) {
              import('@capacitor/app').then(({ App }) => App.exitApp());
            }
          });
        });
        return prev;
      }
    });
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'Dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        goBack,
        currentTab,
        setCurrentTab,
        requestedJobsTab,
        setRequestedJobsTab,
        selectedJob,
        setSelectedJob,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        notifications,
        setNotifications,
        userProfile,
        setUserProfile,
        updateHiringStatus,
        uploadResume,
        deleteResume,
        updateProfileDetails,
        selectedFreelancer,
        setSelectedFreelancer,
        popularCategories,
        shufflePopularCategories,
        isSignOutAlertOpen,
        requestSignOut,
        closeSignOutAlert,
        confirmSignOut,
        collaborateTarget,
        requestCollaborate,
        closeCollaborateAlert,
        confirmCollaborate,
        applyTarget,
        requestApplyJob,
        closeApplyAlert,
        confirmApplyJob,
        hasUnreadAlerts,
        notificationsList,
        markAllAlertsAsRead,
        markAlertAsRead,
        messageThreads,
        markThreadAsRead,
        threadMessages,
        getMessages,
        sendMessage,
        ensureChatThread,
        typingThreads,
        isThreadTyping,
        savedJobIds,
        appliedJobIds,
        toggleSaveJob,
        applyToJob,
        withdrawApplication,
        isJobSaved,
        isJobApplied,
        followingFreelancerIds,
        toggleFollowFreelancer,
        isFollowingFreelancer,
        jobsList,
        myPostedJobs,
        postJob,
        deleteJob,
        authenticatedUser,
        isAuthLoading,
        authMessage,
        setAuthMessage,
        login,
        register,
        logout,
        refreshUser,
        registeredAccounts,
        saveRegisteredAccount,
        deleteRegisteredAccount,
        switchAccountMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
