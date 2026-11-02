const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /const \{ currentScreen, setCurrentScreen, currentTab, setCurrentTab \} = useAppContext\(\);\s*useEffect\(\(\) => \{\s*let listener: any = null;\s*const setupListener = async \(\) => \{\s*listener = await CapacitorApp\.addListener\('backButton', \(\) => \{[\s\S]*?\}\);\s*\};\s*setupListener\(\);\s*return \(\) => \{\s*if \(listener\) \{\s*listener\.remove\(\);\s*\}\s*\};\s*\}, \[currentScreen, setCurrentScreen, currentTab, setCurrentTab\]\);/;

const replacement = `const { currentScreen, goBack } = useAppContext();

  useEffect(() => {
    let listener: any = null;

    const setupListener = async () => {
      listener = await CapacitorApp.addListener('backButton', () => {
        goBack();
      });
    };

    setupListener();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [goBack]);`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
