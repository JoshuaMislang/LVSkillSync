const fs = require('fs');
let code = fs.readFileSync('src/AppContext.tsx', 'utf-8');

const regex = /const newHistory = \[\.\.\.prev\];\s*newHistory\.pop\(\); \/\/ remove current\s*const prevState = newHistory\[newHistory\.length - 1\];/;

const replacement = `const newHistory = [...prev];
        newHistory.pop(); // remove current
        const prevState = newHistory[newHistory.length - 1];
        
        if (prevState.screen === 'Splash' || prevState.screen === 'Login') {
          import('@capacitor/app').then(({ App }) => App.exitApp());
          return prev; // don't mutate history, just exit
        }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/AppContext.tsx', code);
