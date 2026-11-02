import { useEffect, useRef } from 'react';
import { useAppContext } from '../AppContext';
import BottomNav from '../components/BottomNav';
import DesktopSidebar from '../components/DesktopSidebar';
import Home from './Home';
import Jobs from './Jobs';
import Freelancers from './Freelancers';
import Messages from './Messages';
import Notifications from './Notifications';
import Profile from './Profile';
import { motion, AnimatePresence } from 'motion/react';

export default function Main() {
  const { currentTab } = useAppContext();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [currentTab]);

  return (
    <div className="flex min-h-screen bg-background dark:bg-[#070D1F] transition-colors">
      {/* Desktop Sidebar Navigation (Fixed on left on screens >= 1024px) */}
      <DesktopSidebar />

      {/* Main Content Area: Offsets the fixed sidebar on desktop (lg:pl-64 xl:pl-72) */}
      <div className="flex-1 min-w-0 lg:pl-64 xl:pl-72 flex flex-col min-h-screen">
        <main ref={mainRef} className="flex-1 w-full max-w-7xl mx-auto overflow-y-auto no-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {currentTab === 'Home' && <Home />}
              {currentTab === 'Jobs' && <Jobs />}
              {currentTab === 'Freelancers' && <Freelancers />}
              {currentTab === 'Messages' && <Messages />}
              {currentTab === 'Notifications' && <Notifications />}
              {currentTab === 'Profile' && <Profile />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Automatically visible on mobile screens < 1024px) */}
      <BottomNav />
    </div>
  );
}
