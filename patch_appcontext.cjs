const fs = require('fs');
let code = fs.readFileSync('src/AppContext.tsx', 'utf-8');

code = code.replace(
  "interface AppContextType {",
  "interface AppContextType {\n  goBack: () => void;"
);

const providerRegex = /export function AppProvider\(\{ children \}: \{ children: ReactNode \}\) \{[\s\S]*?const \[userProfile, setUserProfile\] = useState<User>\(currentUser\);/;

const providerReplacement = `export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, _setCurrentScreen] = useState<Screen>('Splash');
  const [currentTab, _setCurrentTab] = useState<Tab>('Home');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedChat, setSelectedChat] = useState<MessageThread | null>(null);
  const [theme, setTheme] = useState<'Light' | 'Dark'>('Light');
  const [notifications, setNotifications] = useState<'On' | 'Off'>('On');
  const [userProfile, setUserProfile] = useState<User>(currentUser);
  const [history, setHistory] = useState<{screen: Screen, tab: Tab}[]>([{screen: 'Splash', tab: 'Home'}]);

  const setCurrentScreen = (screen: Screen) => {
    _setCurrentScreen(screen);
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (last && last.screen === screen) return prev;
      return [...prev, {screen, tab: last ? last.tab : 'Home'}];
    });
  };

  const setCurrentTab = (tab: Tab) => {
    _setCurrentTab(tab);
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (last && last.tab === tab && last.screen === 'Main') return prev;
      return [...prev, {screen: 'Main', tab}];
    });
  };

  const goBack = () => {
    setHistory(prev => {
      if (prev.length > 1) {
        const current = prev[prev.length - 1];
        if (current.screen === 'Login' || current.screen === 'Splash') {
          import('@capacitor/app').then(({ App }) => App.exitApp());
          return prev;
        }

        const newHistory = [...prev];
        newHistory.pop(); // remove current
        const prevState = newHistory[newHistory.length - 1];
        _setCurrentScreen(prevState.screen);
        _setCurrentTab(prevState.tab);
        return newHistory;
      } else {
        import('@capacitor/app').then(({ App }) => App.exitApp());
        return prev;
      }
    });
  };`;

code = code.replace(providerRegex, providerReplacement);

code = code.replace(
  "currentScreen,\n        setCurrentScreen,",
  "currentScreen,\n        setCurrentScreen,\n        goBack,"
);

fs.writeFileSync('src/AppContext.tsx', code);
