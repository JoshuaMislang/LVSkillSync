const fs = require('fs');
let code = fs.readFileSync('src/AppContext.tsx', 'utf-8');

code = code.replace(
  "import { Screen, Tab, Job, MessageThread } from './types';",
  "import { Screen, Tab, Job, MessageThread, User } from './types';\nimport { currentUser } from './data';"
);

code = code.replace(
  "  setSelectedChat: (chat: MessageThread | null) => void;",
  `  setSelectedChat: (chat: MessageThread | null) => void;
  theme: 'Light' | 'Dark';
  setTheme: (theme: 'Light' | 'Dark') => void;
  notifications: 'On' | 'Off';
  setNotifications: (notifications: 'On' | 'Off') => void;
  userProfile: User;
  setUserProfile: (user: User) => void;`
);

const providerRegex = /const \[selectedChat, setSelectedChat\] = useState<MessageThread \| null>\(null\);/;
const providerReplacement = `const [selectedChat, setSelectedChat] = useState<MessageThread | null>(null);
  const [theme, setTheme] = useState<'Light' | 'Dark'>('Light');
  const [notifications, setNotifications] = useState<'On' | 'Off'>('On');
  const [userProfile, setUserProfile] = useState<User>(currentUser);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'Dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);`;

code = code.replace(providerRegex, providerReplacement);
code = code.replace(
  "import { createContext, useContext, useState, ReactNode } from 'react';",
  "import { createContext, useContext, useState, useEffect, ReactNode } from 'react';"
);

const valuesRegex = /setSelectedChat,/;
const valuesReplacement = `setSelectedChat,
        theme,
        setTheme,
        notifications,
        setNotifications,
        userProfile,
        setUserProfile,`;

code = code.replace(valuesRegex, valuesReplacement);

fs.writeFileSync('src/AppContext.tsx', code);
