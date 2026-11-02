import { useAppContext } from '../AppContext';
import BrandLogo from './BrandLogo';
import { 
  Home, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  User, 
  Calculator, 
  Settings as SettingsIcon, 
  Moon, 
  Sun
} from 'lucide-react';
import { Tab } from '../types';

export default function DesktopHeader() {
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
  } = useAppContext();

  const navItems: { tab: Tab; label: string; icon: any }[] = [
    { tab: 'Home', label: 'Home', icon: Home },
    { tab: 'Jobs', label: 'Opportunities', icon: Briefcase },
    { tab: 'Messages', label: 'Messages', icon: MessageSquare },
    { tab: 'Notifications', label: 'Alerts', icon: Bell },
    { tab: 'Profile', label: 'Profile', icon: User },
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

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <BrandLogo imageSrc="/main_logo.png" size="md-plus" showText lightText={false} />
          </div>

          {/* Center: Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentScreen === 'Main' && currentTab === item.tab;
              const Icon = item.icon;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.tab === 'Notifications' && hasUnreadAlerts && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                  {item.tab === 'Messages' && messageThreads.some(t => t.unread) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Theme Toggle, Calculator Tool, Settings, Profile */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Quick Calculator Tool */}
            <button
              onClick={() => setCurrentScreen('Calculator')}
              className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors ${
                currentScreen === 'Calculator' ? 'ring-2 ring-blue-600 text-blue-600' : ''
              }`}
              title="Student Earnings Calculator"
              aria-label="Student Earnings Calculator"
            >
              <Calculator className="w-4 h-4" />
            </button>
            {/* Dark/Light Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'Light' ? 'Dark' : 'Light')}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
              title={`Switch to ${theme === 'Light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'Light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Settings Screen Shortcut */}
            <button
              onClick={() => setCurrentScreen('Settings')}
              className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors ${
                currentScreen === 'Settings' ? 'ring-2 ring-blue-600 text-blue-600' : ''
              }`}
              title="App Settings & Diagnostics"
              aria-label="Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            {/* Profile avatar / chip */}
            <button
              onClick={() => {
                setCurrentScreen('Main');
                setCurrentTab('Profile');
              }}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-colors"
            >
              <img
                src={userProfile.avatar || authenticatedUser?.avatar_url || "https://i.pravatar.cc/150?u=u1"}
                alt="User Profile"
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-600/30"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight line-clamp-1">
                  {displayName}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium leading-tight">
                  Student Freelancer
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
