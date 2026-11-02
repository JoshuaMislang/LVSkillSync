import { useAppContext } from '../AppContext';
import { Home, Briefcase, Users, MessageSquare, Bell, User } from 'lucide-react';

export default function BottomNav() {
  const { currentTab, setCurrentTab, hasUnreadAlerts, messageThreads } = useAppContext();

  const tabs = [
    { id: 'Home', icon: Home, label: 'Home' },
    { id: 'Jobs', icon: Briefcase, label: 'Gigs' },
    { id: 'Freelancers', icon: Users, label: 'Talent' },
    { id: 'Messages', icon: MessageSquare, label: 'Messages' },
    { id: 'Notifications', icon: Bell, label: 'Alerts' },
    { id: 'Profile', icon: User, label: 'Profile' },
  ] as const;

  const hasUnreadMessages = messageThreads.some(t => t.unread);

  return (
    <nav
      id="main-bottom-nav"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 w-full lg:hidden bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-1 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around z-40 shadow-[0_-4px_16px_rgba(11,25,44,0.04)]"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id.toLowerCase()}`}
            onClick={() => {
              setCurrentTab(tab.id as any);
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-1 px-0.5 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-medium'
            }`}
          >
            <div
              className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  : 'bg-transparent text-slate-400 dark:text-slate-500'
              }`}
            >
              <Icon
                className="w-4 h-4 sm:w-5 sm:h-5"
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              {tab.id === 'Notifications' && hasUnreadAlerts && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#0B132B]" />
              )}
              {tab.id === 'Messages' && hasUnreadMessages && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-[#0B132B]" />
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
