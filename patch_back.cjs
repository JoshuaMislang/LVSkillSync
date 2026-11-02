const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /const \{ currentScreen, setCurrentScreen \} = useAppContext\(\);\s*useEffect\(\(\) => \{\s*const handleBackButton = \(\) => \{\s*if \(currentScreen === 'Main' \|\| currentScreen === 'Login' \|\| currentScreen === 'Splash'\) \{\s*CapacitorApp\.exitApp\(\);\s*\} else if \(currentScreen === 'Register'\) \{\s*setCurrentScreen\('Login'\);\s*\} else \{\s*setCurrentScreen\('Main'\);\s*\}\s*\};\s*CapacitorApp\.addListener\('backButton', handleBackButton\);\s*return \(\) => \{\s*CapacitorApp\.removeAllListeners\(\);\s*\};\s*\}, \[currentScreen, setCurrentScreen\]\);/;

const replacement = `const { currentScreen, setCurrentScreen, currentTab, setCurrentTab } = useAppContext();

  useEffect(() => {
    let listener: any = null;

    const setupListener = async () => {
      listener = await CapacitorApp.addListener('backButton', () => {
        if (currentScreen === 'Main') {
          if (currentTab !== 'Home') {
            setCurrentTab('Home');
          } else {
            CapacitorApp.exitApp();
          }
        } else if (currentScreen === 'Login' || currentScreen === 'Splash') {
          CapacitorApp.exitApp();
        } else if (currentScreen === 'Register') {
          setCurrentScreen('Login');
        } else {
          setCurrentScreen('Main');
        }
      });
    };

    setupListener();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [currentScreen, setCurrentScreen, currentTab, setCurrentTab]);`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
