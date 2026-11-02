import { ReactNode } from 'react';
import { useAppContext } from '../AppContext';
import BrandLogo from './BrandLogo';
import { 
  Home, 
  Briefcase, 
  Users,
  MessageSquare, 
  Bell, 
  User, 
  Calculator, 
  Settings as SettingsIcon, 
  Moon, 
  Sun,
  LogOut,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Tab } from '../types';

export default function DesktopSidebar() {
  const { 
    currentScreen, 
    setCurrentScreen, 
    currentTab, 
    setCurrentTab, 
    theme, 
    setTheme, 
    authenticatedUser,
    userProfile,
    hasUnreadAlerts,
    messageThreads,
    requestSignOut,
  } = useAppContext();

  const unreadMessagesCount = messageThreads.filter(t => t.unread).length;

  const navItems: { tab: Tab; label: string; icon: any; badge?: ReactNode }[] = [
    { 
      tab: 'Home', 
      label: 'Home', 
      icon: Home 
    },
    { 
      tab: 'Jobs', 
      label: 'Opportunities', 
      icon: Briefcase 
    },
    { 
      tab: 'Freelancers', 
      label: 'Freelancers', 
      icon: Users 
    },
    { 
      tab: 'Messages', 
      label: 'Messages', 
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? (
        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
          {unreadMessagesCount}
        </span>
      ) : null
    },
    { 
      tab: 'Notifications', 
      label: 'Alerts', 
      icon: Bell,
      badge: hasUnreadAlerts ? (
        <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white dark:ring-[#0B132B]" />
      ) : null
    },
    { 
      tab: 'Profile', 
      label: 'My Profile', 
      icon: User 
    },
  ];

  const handleNavClick = (tab: Tab) => {
    setCurrentTab(tab);
    if (currentScreen !== 'Main') {
      setCurrentScreen('Main');
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const displayName = authenticatedUser 
    ? `${authenticatedUser.first_name} ${authenticatedUser.last_name}`
    : userProfile.name;

  const displaySkill = authenticatedUser?.skill || userProfile.skill || 'Student Freelancer';

  return (
    <aside 
      aria-label="Desktop Sidebar Navigation"
      className="hidden lg:flex flex-col w-64 xl:w-72 fixed inset-y-0 left-0 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 z-30 select-none shadow-[2px_0_12px_rgba(11,25,44,0.03)]"
    >
      {/* 1. Header / Brand Logo Section */}
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <BrandLogo imageSrc="/main_logo.png" size="md-plus" showText lightText={false} />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            0% Student Fee Hub
          </span>
          <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900/40">
            LVCC
          </span>
        </div>
      </div>

      {/* 2. Navigation List & Quick Tools */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-6">
        {/* Main Navigation */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentScreen === 'Main' && currentTab === item.tab;
              const Icon = item.icon;

              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 ring-1 ring-blue-500'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tools & Utilities */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Tools & Settings
          </div>
          <div className="space-y-1">
            {/* Student Earnings Calculator */}
            <button
              onClick={() => {
                setCurrentScreen('Calculator');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                currentScreen === 'Calculator'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calculator className={`w-4 h-4 transition-transform group-hover:scale-110 ${currentScreen === 'Calculator' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>Earnings Calculator</span>
              </div>
            </button>

            {/* Settings & System Diagnostics */}
            <button
              onClick={() => {
                setCurrentScreen('Settings');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                currentScreen === 'Settings'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <SettingsIcon className={`w-4 h-4 transition-transform group-hover:scale-110 ${currentScreen === 'Settings' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>Settings</span>
              </div>
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'Light' ? 'Dark' : 'Light')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-center gap-3">
                {theme === 'Light' ? (
                  <Moon className="w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform group-hover:scale-110" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:scale-110" />
                )}
                <span>Appearance</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {theme === 'Light' ? 'Light' : 'Dark'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Student Profile Card & Logout */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40">
        <div 
          onClick={() => handleNavClick('Profile')}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 transition-all cursor-pointer group"
          title="Go to student profile"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={userProfile.avatar || authenticatedUser?.avatar_url || "https://i.pravatar.cc/150?u=u1"}
                alt="Student Profile"
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-blue-600/30 group-hover:ring-blue-600 transition-all"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0B132B]" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  {displayName}
                </span>
                <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {displaySkill}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              requestSignOut();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
