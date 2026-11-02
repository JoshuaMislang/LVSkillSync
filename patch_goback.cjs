const fs = require('fs');
let code = fs.readFileSync('src/AppContext.tsx', 'utf-8');

const regex = /const goBack = useCallback\(\(\) => \{[\s\S]*?\}, \[\]\);/;

const replacement = `const goBack = useCallback(() => {
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
        
        // Execute side effects outside of the return, but wait, React allows this as long as it's just setState
        setTimeout(() => {
          _setCurrentScreen(prevState.screen);
          _setCurrentTab(prevState.tab);
        }, 0);
        
        return newHistory;
      } else {
        import('@capacitor/app').then(({ App }) => App.exitApp());
        return prev;
      }
    });
  }, []);`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/AppContext.tsx', code);
