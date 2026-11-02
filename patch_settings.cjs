const fs = require('fs');
let code = fs.readFileSync('src/screens/Settings.tsx', 'utf-8');

// Remove local state
code = code.replace(
  "  const [theme, setTheme] = useState('Light');\n  const [notifications, setNotifications] = useState('On');",
  "  const { theme, setTheme, notifications, setNotifications } = useAppContext();"
);

// Add some dark classes
code = code.replace(
  'className="flex flex-col min-h-screen bg-background"',
  'className="flex flex-col min-h-screen bg-background dark:bg-gray-900"'
);

code = code.replace(
  'className="px-6 py-4 flex items-center sticky top-0 z-10 bg-background"',
  'className="px-6 py-4 flex items-center sticky top-0 z-10 bg-background dark:bg-gray-900"'
);

code = code.replace(
  'className="text-xl font-bold text-gray-900 ml-4"',
  'className="text-xl font-bold text-gray-900 dark:text-white ml-4"'
);

code = code.replace(
  'className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"',
  'className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 dark:text-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"'
);

code = code.replace(
  'className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100"',
  'className="bg-white dark:bg-gray-800 rounded-[24px] overflow-hidden shadow-sm border border-slate-100 dark:border-gray-700"'
);

code = code.replaceAll(
  'hover:bg-slate-50 transition-colors ${i !== group.items.length - 1 ? \'border-b border-slate-50\' : \'\'}',
  'hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors ${i !== group.items.length - 1 ? \'border-b border-slate-50 dark:border-gray-700\' : \'\'}'
);

code = code.replaceAll(
  'className="font-semibold text-gray-800"',
  'className="font-semibold text-gray-800 dark:text-gray-100"'
);

code = code.replaceAll(
  'className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"',
  'className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center"'
);

code = code.replaceAll(
  'className="w-4 h-4 text-gray-600"',
  'className="w-4 h-4 text-gray-600 dark:text-gray-300"'
);

fs.writeFileSync('src/screens/Settings.tsx', code);
