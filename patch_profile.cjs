const fs = require('fs');
let code = fs.readFileSync('src/screens/Profile.tsx', 'utf-8');

// Replace currentUser with userProfile
code = code.replace(
  "import { currentUser } from '../data';",
  ""
);

code = code.replace(
  "const { setCurrentScreen } = useAppContext();",
  "const { setCurrentScreen, userProfile, setUserProfile } = useAppContext();\n  const [isEditing, setIsEditing] = useState(false);\n  const [editName, setEditName] = useState(userProfile.name);\n  const [editSkill, setEditSkill] = useState(userProfile.skill || '');"
);

code = code.replaceAll('currentUser.', 'userProfile.');

// Handle edit profile click
code = code.replace(
  "onClick={() => showToast('Profile edited successfully!')}",
  "onClick={() => setIsEditing(true)}"
);

// Add dark mode classes
code = code.replace(
  'className="p-6 pb-24"',
  'className="p-6 pb-24 min-h-screen dark:bg-gray-900"'
);

code = code.replace(
  'className="text-2xl font-bold text-text-dark"',
  'className="text-2xl font-bold text-text-dark dark:text-white"'
);

code = code.replace(
  'className="p-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-600 hover:shadow-md transition-shadow"',
  'className="p-2 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-full shadow-sm border border-slate-200 text-slate-600 dark:text-gray-300 hover:shadow-md transition-shadow"'
);

code = code.replace(
  'className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center mb-6"',
  'className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-gray-700 flex flex-col items-center text-center mb-6"'
);

code = code.replace(
  'className="text-xl font-bold text-gray-900"',
  'className="text-xl font-bold text-gray-900 dark:text-white"'
);

code = code.replace(
  'className="text-sm text-gray-500 mb-4"',
  'className="text-sm text-gray-500 dark:text-gray-400 mb-4"'
);

code = code.replace(
  'className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-full text-sm w-full hover:bg-slate-200 transition-colors"',
  'className="px-6 py-2 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-200 font-semibold rounded-full text-sm w-full hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"'
);

code = code.replaceAll(
  'className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 flex flex-col items-center"',
  'className="bg-white dark:bg-gray-800 p-4 rounded-[20px] shadow-sm border border-slate-100 dark:border-gray-700 flex flex-col items-center"'
);

code = code.replaceAll(
  'className="text-xl font-bold text-gray-900"',
  'className="text-xl font-bold text-gray-900 dark:text-white"'
);

code = code.replaceAll(
  'className="text-xs text-slate-500 font-medium"',
  'className="text-xs text-slate-500 dark:text-gray-400 font-medium"'
);

code = code.replace(
  'className="w-full bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow"',
  'className="w-full bg-white dark:bg-gray-800 p-4 rounded-[20px] shadow-sm border border-slate-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow"'
);

code = code.replace(
  'className="w-full bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow"',
  'className="w-full bg-white dark:bg-gray-800 p-4 rounded-[20px] shadow-sm border border-slate-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow"'
);

code = code.replaceAll(
  'className="font-semibold text-gray-700"',
  'className="font-semibold text-gray-700 dark:text-gray-200"'
);

const editModal = `
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-[24px] p-6 w-full max-w-sm shadow-xl"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Profile</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skill/Role</label>
                  <input 
                    type="text" 
                    value={editSkill}
                    onChange={(e) => setEditSkill(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-200 font-semibold rounded-full text-sm hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setUserProfile({ ...userProfile, name: editName, skill: editSkill });
                    setIsEditing(false);
                    showToast('Profile updated!');
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-full text-sm hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
`;

// Insert the modal just after <AnimatePresence> for toast
code = code.replace(
  '</AnimatePresence>',
  `</AnimatePresence>${editModal}`
);

fs.writeFileSync('src/screens/Profile.tsx', code);
