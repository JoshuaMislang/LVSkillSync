const fs = require('fs');
const files = [
  'src/screens/Home.tsx',
  'src/screens/Jobs.tsx',
  'src/screens/Messages.tsx',
  'src/screens/Notifications.tsx',
  'src/screens/Main.tsx',
  'src/screens/JobDetails.tsx',
  'src/screens/Chat.tsx',
  'src/components/BottomNav.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf-8');
  
  // Backgrounds
  code = code.replaceAll('bg-background', 'bg-background dark:bg-gray-900');
  code = code.replaceAll('bg-white', 'bg-white dark:bg-gray-800');
  code = code.replaceAll('bg-gray-50', 'bg-gray-50 dark:bg-gray-900');
  code = code.replaceAll('bg-slate-50', 'bg-slate-50 dark:bg-gray-800');
  code = code.replaceAll('bg-slate-100', 'bg-slate-100 dark:bg-gray-700');
  code = code.replaceAll('hover:bg-gray-100', 'hover:bg-gray-100 dark:hover:bg-gray-700');
  code = code.replaceAll('hover:bg-slate-50', 'hover:bg-slate-50 dark:hover:bg-gray-700');

  // Text colors
  code = code.replaceAll('text-gray-900', 'text-gray-900 dark:text-white');
  code = code.replaceAll('text-text-dark', 'text-text-dark dark:text-white');
  code = code.replaceAll('text-gray-800', 'text-gray-800 dark:text-gray-100');
  code = code.replaceAll('text-gray-600', 'text-gray-600 dark:text-gray-300');
  code = code.replaceAll('text-gray-500', 'text-gray-500 dark:text-gray-400');
  code = code.replaceAll('text-slate-600', 'text-slate-600 dark:text-gray-300');
  code = code.replaceAll('text-slate-500', 'text-slate-500 dark:text-gray-400');
  
  // Borders
  code = code.replaceAll('border-slate-100', 'border-slate-100 dark:border-gray-700');
  code = code.replaceAll('border-slate-200', 'border-slate-200 dark:border-gray-600');
  code = code.replaceAll('border-gray-100', 'border-gray-100 dark:border-gray-700');
  code = code.replaceAll('border-gray-200', 'border-gray-200 dark:border-gray-600');
  code = code.replaceAll('border-white', 'border-white dark:border-gray-800');

  // Cleanup duplicates that might have happened
  code = code.replaceAll('dark:bg-gray-900 dark:bg-gray-900', 'dark:bg-gray-900');
  code = code.replaceAll('dark:bg-gray-800 dark:bg-gray-800', 'dark:bg-gray-800');
  code = code.replaceAll('dark:text-white dark:text-white', 'dark:text-white');
  
  fs.writeFileSync(file, code);
});
console.log('Patched');
