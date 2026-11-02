const fs = require('fs');
let code = fs.readFileSync('src/screens/Notifications.tsx', 'utf-8');

code = code.replace(
  "import { motion } from 'motion/react';",
  "import { motion } from 'motion/react';\nimport { useAppContext } from '../AppContext';"
);

code = code.replace(
  "export default function Notifications() {",
  "export default function Notifications() {\n  const { notifications: notifsSetting, setNotifications } = useAppContext();"
);

const renderList = `
      {notifsSetting === 'Off' ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Notifications are off</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-[250px]">You won't receive updates about new jobs, messages, or promotions.</p>
          <button 
            onClick={() => setNotifications('On')}
            className="px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-blue-700 transition-colors"
          >
            Turn On
          </button>
        </div>
      ) : (
        <div className="space-y-4 pb-6">
          {notifications.map((notif) => (
            <motion.div 
              whileTap={{ scale: 0.98 }}
              key={notif.id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-gray-700 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className={\`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 \${getBg(notif.type)}\`}>
                {getIcon(notif.type)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{notif.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{notif.description}</p>
                <span className="text-xs text-gray-400 font-medium">{notif.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
`;

code = code.replace(
  /<div className="space-y-4 pb-6">[\s\S]*?<\/div>\s*<\/div>\s*<empty>/, // wait this regex is wrong, better to replace the exact block
  ""
);

code = code.replace(
  /<div className="space-y-4 pb-6">[\s\S]*?<\/div>\n    <\/div>/,
  renderList + '\n    </div>'
);


fs.writeFileSync('src/screens/Notifications.tsx', code);
