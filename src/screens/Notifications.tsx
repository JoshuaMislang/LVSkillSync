import { useState } from 'react';
import { notifications } from '../data';
import { Bell, CheckCircle2, Info, Tag, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../AppContext';

export default function Notifications() {
  const { 
    notifications: notifsSetting, 
    setNotifications,
    hasUnreadAlerts,
    notificationsList,
    markAllAlertsAsRead,
    markAlertAsRead 
  } = useAppContext();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleMarkAllRead = () => {
    markAllAlertsAsRead();
    showToast('All alerts marked as read. Yellow dot cleared!');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'promotion': return <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default: return <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40';
      case 'info': return 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40';
      case 'warning': return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40';
      case 'promotion': return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40';
      default: return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div id="notifications-screen" className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-24 lg:pb-12 bg-slate-50 dark:bg-[#0B132B] min-h-screen">
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

      <div className="flex justify-between items-start mb-5 pt-2">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-[#0B192C] dark:text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gig alerts, escrow updates, and messages
          </p>
        </div>
        <button 
          id="notifs-mark-all-read-btn"
          onClick={handleMarkAllRead}
          className={`text-xs font-semibold py-1.5 px-3 rounded-xl transition-all ${
            hasUnreadAlerts 
              ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900' 
              : 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 cursor-default'
          }`}
        >
          {hasUnreadAlerts ? 'Mark all as read' : '✓ All caught up'}
        </button>
      </div>

      {notifsSetting === 'Off' ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white dark:bg-[#111E38] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
            <Bell className="w-7 h-7" />
          </div>
          <h2 className="font-heading font-extrabold text-lg text-[#0B192C] dark:text-white mb-1.5">
            Notifications Are Disabled
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 max-w-xs leading-relaxed">
            Turn alerts back on to get instant updates about incoming project inquiries, milestones, and student earnings.
          </p>
          <button 
            onClick={() => {
              setNotifications('On');
              showToast('Student notifications activated!');
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            Turn On Notifications
          </button>
        </div>
      ) : (
        <div className="space-y-3 pb-6">
          {notificationsList.map((notif) => {
            const isUnread = !notif.is_read;
            return (
              <motion.div 
                whileTap={{ scale: 0.98 }}
                key={notif.id} 
                onClick={() => {
                  markAlertAsRead(notif.id);
                  showToast(`Viewed: ${notif.title}`);
                }}
                className={`p-4 rounded-2xl shadow-sm border transition-all cursor-pointer flex gap-3.5 ${
                  isUnread
                    ? 'bg-white dark:bg-[#111E38] border-amber-300/80 dark:border-amber-800/80 ring-1 ring-amber-400/20'
                    : 'bg-white/80 dark:bg-[#111E38]/80 border-slate-200/80 dark:border-slate-800 opacity-90 hover:opacity-100'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border ${getBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="flex items-center gap-2 truncate">
                      <h3 className="font-heading font-bold text-[#0B192C] dark:text-white text-xs sm:text-sm truncate">
                        {notif.title}
                      </h3>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title="Unread alert" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium ml-2 flex-shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {notif.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
